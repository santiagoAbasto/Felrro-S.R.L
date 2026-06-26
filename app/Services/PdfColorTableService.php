<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class PdfColorTableService
{
    public function store(Product $product, UploadedFile $file): string
    {
        if ($product->pdf_color_table && Storage::disk('public')->exists($product->pdf_color_table)) {
            Storage::disk('public')->delete($product->pdf_color_table);
        }

        if ($this->isPdf($file)) {
            return $this->storePdfAsImage($product, $file);
        }

        $path = $file->storeAs(
            'products/pdf-color-tables',
            $product->slug . '.' . strtolower($file->extension()),
            'public'
        );

        $product->update(['pdf_color_table' => $path]);

        return $path;
    }

    private function isPdf(UploadedFile $file): bool
    {
        return strtolower($file->extension()) === 'pdf'
            || $file->getMimeType() === 'application/pdf';
    }

    private function storePdfAsImage(Product $product, UploadedFile $file): string
    {
        $path = 'products/pdf-color-tables/' . $product->slug . '.png';
        Storage::disk('public')->makeDirectory('products/pdf-color-tables');

        $target = Storage::disk('public')->path($path);
        $source = $file->getRealPath();

        if (! $source || ! is_file($source)) {
            throw ValidationException::withMessages([
                'pdf_color_table' => 'No se pudo leer el PDF de la tabla de color.',
            ]);
        }

        $this->convertFirstPdfPageToPng($source, $target);

        $product->update(['pdf_color_table' => $path]);

        return $path;
    }

    private function convertFirstPdfPageToPng(string $source, string $target): void
    {
        if ($this->convertWithImagick($source, $target)) {
            return;
        }

        if ($this->convertWithPdftoppm($source, $target)) {
            return;
        }

        if ($this->convertWithImageMagickCommand($source, $target)) {
            return;
        }

        throw ValidationException::withMessages([
            'pdf_color_table' => 'El servidor no pudo convertir el PDF a imagen. Instalá Imagick, Poppler/pdftoppm o ImageMagick, o subí la tabla como PNG/JPG/WEBP.',
        ]);
    }

    private function convertWithImagick(string $source, string $target): bool
    {
        if (! class_exists(\Imagick::class)) {
            return false;
        }

        try {
            $image = new \Imagick();
            $image->setResolution(220, 220);
            $image->readImage($source . '[0]');
            $image->setImageBackgroundColor('white');
            $flattened = $image->mergeImageLayers(\Imagick::LAYERMETHOD_FLATTEN);
            $flattened->setImageFormat('png');
            $flattened->writeImage($target);
            $flattened->clear();
            $flattened->destroy();
            $image->clear();
            $image->destroy();

            return is_file($target);
        } catch (\Throwable) {
            return false;
        }
    }

    private function convertWithPdftoppm(string $source, string $target): bool
    {
        $binary = $this->findBinary('pdftoppm');

        if (! $binary) {
            return false;
        }

        $prefix = tempnam(sys_get_temp_dir(), 'felrro-color-table-');

        if (! $prefix) {
            return false;
        }

        @unlink($prefix);
        $output = $prefix . '.png';

        $command = sprintf(
            '%s -f 1 -singlefile -png -r 220 %s %s 2>&1',
            escapeshellcmd($binary),
            escapeshellarg($source),
            escapeshellarg($prefix)
        );

        exec($command, $lines, $exitCode);

        if ($exitCode === 0 && is_file($output)) {
            rename($output, $target);

            return is_file($target);
        }

        @unlink($output);

        return false;
    }

    private function convertWithImageMagickCommand(string $source, string $target): bool
    {
        $binary = $this->findBinary('magick') ?: $this->findBinary('convert');

        if (! $binary) {
            return false;
        }

        $command = sprintf(
            '%s -density 220 %s -background white -alpha remove -alpha off %s 2>&1',
            escapeshellcmd($binary),
            escapeshellarg($source . '[0]'),
            escapeshellarg($target)
        );

        exec($command, $lines, $exitCode);

        return $exitCode === 0 && is_file($target);
    }

    private function findBinary(string $name): ?string
    {
        if (! $this->canRunShellCommands()) {
            return null;
        }

        exec('command -v ' . escapeshellarg($name) . ' 2>/dev/null', $output, $exitCode);

        return $exitCode === 0 && ! empty($output[0]) ? $output[0] : null;
    }

    private function canRunShellCommands(): bool
    {
        if (! function_exists('exec')) {
            return false;
        }

        $disabled = array_map(
            'trim',
            explode(',', (string) ini_get('disable_functions'))
        );

        return ! in_array('exec', $disabled, true);
    }
}
