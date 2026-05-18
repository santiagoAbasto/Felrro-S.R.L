<?php

namespace App\Support;

class MediaPath
{
    protected static array $validityCache = [];
    protected const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'];

    public static function imageAsset(?string $path, ?string $fallback = null): ?string
    {
        if (! $path) {
            return $fallback;
        }

        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        [$absolutePath, $assetUrl] = self::resolveLocalImage($path);

        if (! $absolutePath || ! $assetUrl) {
            return $fallback;
        }

        return self::isRenderableImage($absolutePath) ? $assetUrl : $fallback;
    }

    protected static function resolveLocalImage(string $path): array
    {
        $normalizedPath = ltrim($path, '/');

        if (str_starts_with($normalizedPath, 'images/')) {
            return [public_path($normalizedPath), asset($normalizedPath)];
        }

        if (str_starts_with($normalizedPath, 'storage/')) {
            $relativeStoragePath = ltrim(substr($normalizedPath, strlen('storage/')), '/');

            return [
                storage_path('app/public/' . $relativeStoragePath),
                asset('storage/' . $relativeStoragePath),
            ];
        }

        return [
            storage_path('app/public/' . $normalizedPath),
            asset('storage/' . $normalizedPath),
        ];
    }

    protected static function isRenderableImage(string $absolutePath): bool
    {
        if (array_key_exists($absolutePath, self::$validityCache)) {
            return self::$validityCache[$absolutePath];
        }

        if (! is_file($absolutePath)) {
            return self::$validityCache[$absolutePath] = false;
        }

        $extension = strtolower(pathinfo($absolutePath, PATHINFO_EXTENSION));

        return self::$validityCache[$absolutePath] = in_array($extension, self::IMAGE_EXTENSIONS, true);
    }
}
