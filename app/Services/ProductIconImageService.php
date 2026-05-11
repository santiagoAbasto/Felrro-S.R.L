<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ProductIconImageService
{
    private const BACKGROUND_TOLERANCE = 48;
    private const CROP_PADDING = 0;

    public function storeClean(UploadedFile $file, string $slug): string
    {
        $path = 'product-icons/' . $slug . '.png';
        Storage::disk('public')->makeDirectory('product-icons');
        $target = Storage::disk('public')->path($path);

        $image = $this->makeImage($file->getRealPath(), $file->getMimeType());

        if (! $image) {
            return $file->storeAs('product-icons', $slug . '.' . strtolower($file->getClientOriginalExtension()), 'public');
        }

        $this->saveTrimmed($image, $target);

        return $path;
    }

    public function cleanExisting(string $path): bool
    {
        if (! Storage::disk('public')->exists($path)) {
            return false;
        }

        $fullPath = Storage::disk('public')->path($path);
        $mime = Storage::disk('public')->mimeType($path) ?: 'image/png';
        $image = $this->makeImage($fullPath, $mime);

        if (! $image) {
            return false;
        }

        $this->saveTrimmed($image, $fullPath);

        return true;
    }

    private function makeImage(string $path, ?string $mime)
    {
        return match ($mime) {
            'image/jpeg' => @imagecreatefromjpeg($path),
            'image/png' => @imagecreatefrompng($path),
            'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($path) : false,
            default => @imagecreatefromstring((string) @file_get_contents($path)),
        };
    }

    private function saveTrimmed($source, string $target): void
    {
        File::ensureDirectoryExists(dirname($target), 0755, true);

        $width = imagesx($source);
        $height = imagesy($source);
        [$left, $top, $right, $bottom] = $this->contentBounds($source, $width, $height);

        $cropWidth = max(1, $right - $left + 1);
        $cropHeight = max(1, $bottom - $top + 1);
        $output = imagecreatetruecolor($cropWidth, $cropHeight);

        imagealphablending($output, true);
        imagesavealpha($output, false);
        imagefill($output, 0, 0, imagecolorallocate($output, 255, 255, 255));
        imagecopy($output, $source, 0, 0, $left, $top, $cropWidth, $cropHeight);

        imagepng($output, $target);
    }

    private function contentBounds($image, int $width, int $height): array
    {
        $left = $width;
        $top = $height;
        $right = -1;
        $bottom = -1;

        for ($y = 0; $y < $height; $y++) {
            for ($x = 0; $x < $width; $x++) {
                if ($this->isContent($image, $x, $y)) {
                    $left = min($left, $x);
                    $top = min($top, $y);
                    $right = max($right, $x);
                    $bottom = max($bottom, $y);
                }
            }
        }

        if ($right < $left || $bottom < $top) {
            return [0, 0, $width - 1, $height - 1];
        }

        return [
            max(0, $left - self::CROP_PADDING),
            max(0, $top - self::CROP_PADDING),
            min($width - 1, $right + self::CROP_PADDING),
            min($height - 1, $bottom + self::CROP_PADDING),
        ];
    }

    private function isContent($image, int $x, int $y): bool
    {
        $rgba = imagecolorat($image, $x, $y);
        $alpha = ($rgba >> 24) & 0x7F;

        if ($alpha >= 120) {
            return false;
        }

        $red = ($rgba >> 16) & 0xFF;
        $green = ($rgba >> 8) & 0xFF;
        $blue = $rgba & 0xFF;

        return max(abs(255 - $red), abs(255 - $green), abs(255 - $blue)) > self::BACKGROUND_TOLERANCE;
    }
}
