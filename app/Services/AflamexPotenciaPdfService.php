<?php

namespace App\Services;

use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AflamexPotenciaPdfService
{
    public function generate(Product $product): string
    {
        $product->load([
            'applications',
            'category',
            'technicalSections.rows',
            'icons',
        ]);

        $path = 'products/fichas/' . $product->slug . '.pdf';

        $pdf = Pdf::loadView('pdf.products.aflamex-potencia', [
            'product' => $product,
            'applications' => $product->applications->where('type', 'application')->values(),
            'construction' => $product->applications->where('type', 'construction')->values(),
            'extras' => $product->applications->where('type', 'extra')->values(),
            'sections' => $product->technicalSections,
            'icons' => $product->icons
                ->filter(fn ($icon) => (bool) ($icon->pivot->show_in_pdf ?? true))
                ->values(),
            'logoDataUri' => $this->publicDataUri(public_path('images/logo.png')),
            'productImageDataUri' => $this->storageDataUri($product->pdf_graphic ?: $product->image),
            'colorTableDataUri' => $this->storageDataUri($product->pdf_color_table),
        ])
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'isRemoteEnabled' => false,
                'isHtml5ParserEnabled' => true,
                'defaultFont' => 'DejaVu Sans',
                'isFontSubsettingEnabled' => true,
            ]);

        Storage::disk('public')->put($path, $pdf->output());

        $product->update([
            'ficha_tecnica_file' => $path,
            'ficha_tecnica_weight' => Storage::disk('public')->size($path),
            'ficha_tecnica_format' => 'pdf',
        ]);

        return $path;
    }

    public function storageDataUri(?string $path): ?string
    {
        if (!$path || !Storage::disk('public')->exists($path)) {
            return null;
        }

        return $this->dataUri(
            Storage::disk('public')->path($path),
            Storage::disk('public')->mimeType($path) ?: 'image/png'
        );
    }

    public function publicDataUri(string $path): ?string
    {
        if (!is_file($path)) {
            return null;
        }

        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $mime = match ($extension) {
            'jpg', 'jpeg' => 'image/jpeg',
            'svg' => 'image/svg+xml',
            default => 'image/png',
        };

        return $this->dataUri($path, $mime);
    }

    private function dataUri(string $path, string $mime): ?string
    {
        $contents = @file_get_contents($path);

        if ($contents === false) {
            return null;
        }

        return 'data:' . $mime . ';base64,' . base64_encode($contents);
    }

    public function cleanText(?string $value): string
    {
        return trim((string) Str::of($value ?? '')->replaceMatches('/\s+/', ' '));
    }
}
