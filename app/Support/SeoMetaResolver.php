<?php

namespace App\Support;

use App\Models\Page;
use App\Models\SeoMeta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class SeoMetaResolver
{
    public static function resolve(Request $request, mixed $page = null): array
    {
        $routeName = $request->route()?->getName();
        $seoKey = SeoPageResolver::resolveKey($request);
        $seo = self::findSeo($seoKey);

        $defaultTitle = trim((string) ($page instanceof Page ? ($page->getMetaTitle() ?: $page->getTitle()) : null));
        $defaultDescription = trim((string) ($page instanceof Page ? $page->getMetaDescription() : null));

        $resolvedTitle = self::sanitize($seo?->title) ?: $defaultTitle ?: 'Felrro - Cables Especiales';
        $resolvedDescription = self::sanitize($seo?->description)
            ?: $defaultDescription
            ?: 'Fabricación de conductores eléctricos especiales certificados UL e ISO 9001.';
        $resolvedKeywords = self::sanitize($seo?->keywords);
        $resolvedOgImage = $seo?->og_image_url ?: asset('images/logo.png');
        $resolvedUrl = url()->current();

        return [
            'key' => $seoKey,
            'route_name' => $routeName,
            'title' => $resolvedTitle,
            'description' => $resolvedDescription,
            'keywords' => $resolvedKeywords,
            'og_image_url' => $resolvedOgImage,
            'url' => $resolvedUrl,
            'type' => 'website',
        ];
    }

    private static function findSeo(?string $key): ?SeoMeta
    {
        if (!$key || !Schema::hasTable((new SeoMeta())->getTable())) {
            return null;
        }

        return SeoMeta::query()->where('page', $key)->first();
    }

    private static function sanitize(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $clean = trim(Str::of(strip_tags($value))->squish()->value());

        return $clean !== '' ? $clean : null;
    }
}
