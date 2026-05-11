<?php

namespace App\Support;

use App\Models\Page;
use App\Models\Post;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\SeoMeta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class SeoMetaResolver
{
    private static ?bool $seoTableExists = null;

    public static function resolve(
        Request $request,
        mixed $page = null,
        array $context = [],
        ?string $titleFallback = null,
        ?string $descriptionFallback = null,
    ): array
    {
        $routeName = $request->route()?->getName();
        $seoKey = SeoPageResolver::resolveKey($request);
        $seo = self::findSeo($seoKey);
        $contextFallbacks = self::contextFallbacks($page, $context);

        $defaultTitle = self::sanitize($contextFallbacks['title'] ?? null)
            ?: self::sanitize($titleFallback)
            ?: 'Felrro - Cables Especiales';
        $defaultDescription = self::sanitize($contextFallbacks['description'] ?? null)
            ?: self::sanitize($descriptionFallback)
            ?: 'Fabricación de conductores eléctricos especiales certificados UL e ISO 9001.';

        $resolvedTitle = self::sanitize($seo?->title) ?: $defaultTitle ?: 'Felrro - Cables Especiales';
        $resolvedDescription = self::sanitize($seo?->description)
            ?: $defaultDescription
            ?: 'Fabricación de conductores eléctricos especiales certificados UL e ISO 9001.';
        $resolvedKeywords = self::sanitize($seo?->keywords);
        $resolvedOgImage = $seo?->og_image_url ?: ($contextFallbacks['og_image_url'] ?? asset('images/logo.png'));
        $resolvedUrl = url()->current();

        return [
            'key' => $seoKey,
            'route_name' => $routeName,
            'title' => $resolvedTitle,
            'description' => $resolvedDescription,
            'keywords' => $resolvedKeywords,
            'og_image_url' => $resolvedOgImage,
            'url' => $resolvedUrl,
            'type' => $contextFallbacks['type'] ?? 'website',
            'robots' => 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            'locale' => self::openGraphLocale(),
        ];
    }

    private static function findSeo(?string $key): ?SeoMeta
    {
        if (!$key || !self::seoTableExists()) {
            return null;
        }

        return SeoMeta::query()->where('page', $key)->first();
    }

    private static function seoTableExists(): bool
    {
        return self::$seoTableExists ??= Schema::hasTable((new SeoMeta())->getTable());
    }

    private static function contextFallbacks(mixed $page, array $context): array
    {
        $page = $page ?: ($context['page'] ?? null);
        $product = $context['product'] ?? null;
        $category = $context['category'] ?? null;
        $post = $context['post'] ?? null;

        if ($product instanceof Product) {
            return [
                'title' => trim($product->getName() . ' - Felrro'),
                'description' => $product->getShortDescription() ?: $product->getDescription(),
                'og_image_url' => $product->image_url,
                'type' => 'product',
            ];
        }

        if ($category instanceof ProductCategory) {
            return [
                'title' => trim($category->getName() . ' - Productos Felrro'),
                'description' => $category->getDescription(),
                'og_image_url' => $category->image_url,
                'type' => 'website',
            ];
        }

        if ($post instanceof Post) {
            return [
                'title' => trim($post->getTitle() . ' - Felrro'),
                'description' => $post->getExcerpt(),
                'og_image_url' => $post->image_url,
                'type' => 'article',
            ];
        }

        if ($page instanceof Page) {
            return [
                'title' => $page->getMetaTitle() ?: $page->getTitle(),
                'description' => $page->getMetaDescription(),
                'type' => 'website',
            ];
        }

        return [];
    }

    private static function openGraphLocale(): string
    {
        return match (app()->getLocale()) {
            'en' => 'en_US',
            default => 'es_BO',
        };
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
