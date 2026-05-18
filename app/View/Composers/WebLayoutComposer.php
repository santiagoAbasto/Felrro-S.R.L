<?php

namespace App\View\Composers;

use App\Models\SiteSetting;
use App\Support\SeoMetaResolver;
use Illuminate\Contracts\View\Factory as ViewFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\View\View;

class WebLayoutComposer
{
    public function __construct(
        private readonly Request $request,
        private readonly ViewFactory $views,
    ) {
    }

    public function compose(View $view): void
    {
        $data = $view->getData();
        $seoMeta = SeoMetaResolver::resolve(
            request: $this->request,
            page: $data['page'] ?? null,
            context: $data,
            titleFallback: $this->section('title', 'Felrro - Cables Especiales'),
            descriptionFallback: $this->section(
                'meta_description',
                'Fabricación de conductores eléctricos especiales certificados UL e ISO 9001.'
            ),
        );

        $view->with(array_merge(
            $this->seoVariables($seoMeta, $data),
            $this->assetVariables(),
            $this->footerVariables(),
            $this->whatsappVariables(),
        ));
    }

    private function seoVariables(array $seoMeta, array $data): array
    {
        return [
            'htmlLang' => str_replace('_', '-', app()->getLocale() ?: 'es'),
            'metaTitle' => $seoMeta['title'],
            'metaDescription' => $seoMeta['description'],
            'metaKeywords' => $seoMeta['keywords'],
            'metaRobots' => $seoMeta['robots'],
            'canonicalUrl' => $seoMeta['url'],
            'ogTitle' => $seoMeta['title'],
            'ogDescription' => $seoMeta['description'],
            'ogType' => $seoMeta['type'],
            'ogUrl' => $seoMeta['url'],
            'ogImage' => $seoMeta['og_image_url'],
            'ogLocale' => $seoMeta['locale'],
            'twitterCard' => 'summary_large_image',
            'twitterTitle' => $seoMeta['title'],
            'twitterDescription' => $seoMeta['description'],
            'twitterImage' => $seoMeta['og_image_url'],
            'themeColor' => '#0f172a',
            'siteName' => 'Felrro',
            'siteAuthor' => 'Felrro S.R.L.',
            'structuredDataJson' => $this->structuredDataJson($data['structuredData'] ?? null),
        ];
    }

    private function assetVariables(): array
    {
        return [
            'faviconSvgUrl' => $this->versionedAsset('favicon/favicon.svg'),
            'faviconPngUrl' => $this->versionedAsset('favicon/favicon-96x96.png'),
            'faviconIcoUrl' => $this->versionedAsset('favicon/favicon.ico'),
            'fallbackFaviconIcoUrl' => $this->versionedAsset('favicon.ico'),
            'appleTouchIconUrl' => $this->versionedAsset('favicon/apple-touch-icon.png'),
            'manifestUrl' => $this->versionedAsset('favicon/site.webmanifest'),
        ];
    }

    private function footerVariables(): array
    {
        return [
            'footerSettings' => SiteSetting::getRaw('footer') ?? [],
        ];
    }

    private function whatsappVariables(): array
    {
        $locale = app()->getLocale();
        $footer = SiteSetting::getRaw('footer') ?? [];
        $settings = SiteSetting::getRaw('floating_whatsapp') ?? [];
        $phone = $settings['phone'] ?? ($footer['whatsapp'] ?? '');
        $digits = preg_replace('/\D/', '', (string) $phone);
        $message = $this->localized($settings['message'] ?? [], $locale) ?? '';

        return [
            'floatingWhatsappEnabled' => (bool) ($settings['enabled'] ?? true),
            'floatingWhatsappLabel' => $this->localized($settings['label'] ?? [], $locale) ?? 'Contáctanos',
            'floatingWhatsappHref' => $digits
                ? 'https://wa.me/' . $digits . ($message ? '?text=' . rawurlencode($message) : '')
                : null,
            'floatingWhatsappBottomOffset' => (int) ($settings['bottom_offset'] ?? 67),
        ];
    }

    private function versionedAsset(string $path): string
    {
        $absolutePath = public_path($path);
        $version = file_exists($absolutePath) ? filemtime($absolutePath) : '1';

        return asset($path) . '?v=' . $version;
    }

    private function structuredDataJson(mixed $structuredData): ?string
    {
        if (empty($structuredData)) {
            return null;
        }

        if (is_string($structuredData)) {
            return trim($structuredData) !== '' ? $structuredData : null;
        }

        return json_encode($structuredData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    private function section(string $name, string $default): string
    {
        return trim((string) $this->views->yieldContent($name, $default));
    }

    private function localized(mixed $value, string $locale): ?string
    {
        if (is_array($value)) {
            return Arr::get($value, $locale) ?: Arr::get($value, 'es');
        }

        return Str::of((string) $value)->trim()->value() ?: null;
    }
}
