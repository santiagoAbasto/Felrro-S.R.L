<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use App\Models\Post;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Quotation;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = CarbonImmutable::now();
        $trafficStart = $now->subDays(13)->startOfDay();
        $sessionsAvailable = Schema::hasTable('sessions');

        $sessions = $sessionsAvailable
            ? $this->getRecentSessions($trafficStart)
            : collect();

        $deviceBreakdown = $this->countByLabel(
            $sessions,
            fn (object $session) => $this->detectDevice($session->user_agent)
        );

        $browserBreakdown = $this->countByLabel(
            $sessions,
            fn (object $session) => $this->detectBrowser($session->user_agent)
        );

        $osBreakdown = $this->countByLabel(
            $sessions,
            fn (object $session) => $this->detectOs($session->user_agent)
        );

        $activeSessions = $sessions->filter(
            fn (object $session) => $session->activity_at->greaterThanOrEqualTo($now->subMinutes(30))
        );

        $todaySessions = $sessions->filter(
            fn (object $session) => $session->activity_at->isSameDay($now)
        );

        $last7Sessions = $sessions->filter(
            fn (object $session) => $session->activity_at->greaterThanOrEqualTo($now->subDays(6)->startOfDay())
        );

        $previous7Sessions = $sessions->filter(
            fn (object $session) => $session->activity_at->between(
                $now->subDays(13)->startOfDay(),
                $now->subDays(7)->endOfDay()
            )
        );

        $authenticatedSessions = $sessions->filter(
            fn (object $session) => ! empty($session->user_id)
        );

        $anonymousSessions = $sessions->count() - $authenticatedSessions->count();

        $trafficTimeline = $this->buildTimelineFromSessions($sessions, $trafficStart, 14);
        $commercialTimeline = $this->buildTimelineFromModel(Quotation::query(), 'created_at', $trafficStart, 14);
        $messagesTimeline = $this->buildTimelineFromModel(ContactMessage::query(), 'created_at', $trafficStart, 14);
        $newsletterTimeline = $this->buildTimelineFromModel(
            NewsletterSubscriber::query(),
            'subscribed_at',
            $trafficStart,
            14
        );

        $latestQuotations = Quotation::query()
            ->withCount('items')
            ->latest()
            ->take(5)
            ->get();

        $latestMessages = ContactMessage::query()
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'products' => Product::count(),
                'categories' => ProductCategory::count(),
                'posts' => Post::count(),
                'quotations' => Quotation::count(),
                'messages' => ContactMessage::count(),
                'newsletterSubscribers' => NewsletterSubscriber::count(),
            ],
            'overview' => [
                'active_sessions' => $activeSessions->count(),
                'sessions_today' => $todaySessions->count(),
                'sessions_last_7_days' => $last7Sessions->count(),
                'unique_visitors_30_days' => $sessions->pluck('ip_address')->filter()->unique()->count(),
                'authenticated_sessions' => $authenticatedSessions->count(),
                'anonymous_sessions' => $anonymousSessions,
                'unread_messages' => ContactMessage::query()->unread()->count(),
                'pending_quotations' => Quotation::count(),
                'newsletter_active' => NewsletterSubscriber::query()->active()->count(),
                'top_device' => $this->topLabel($deviceBreakdown, 'Sin datos todavía'),
                'top_browser' => $this->topLabel($browserBreakdown, 'Sin datos todavía'),
                'top_os' => $this->topLabel($osBreakdown, 'Sin datos todavía'),
                'growth_sessions_last_7_days' => $this->calculateGrowth(
                    $last7Sessions->count(),
                    $previous7Sessions->count()
                ),
            ],
            'traffic' => [
                'sessions_available' => $sessionsAvailable,
                'daily' => $trafficTimeline,
                'devices' => $deviceBreakdown,
                'browsers' => $browserBreakdown,
                'operating_systems' => $osBreakdown,
                'top_networks' => $this->topNetworks($sessions),
                'location_notice' => [
                    'title' => 'Ubicación geográfica no activada',
                    'description' => 'El panel hoy muestra redes e IPs enmascaradas para cuidar privacidad. Si más adelante querés ciudades o países reales, hay que sumar un servicio GeoIP seguro.',
                ],
            ],
            'activity' => [
                'traffic_timeline' => $trafficTimeline,
                'commercial_timeline' => $commercialTimeline,
                'messages_timeline' => $messagesTimeline,
                'newsletter_timeline' => $newsletterTimeline,
            ],
            'latestQuotations' => $latestQuotations,
            'latestMessages' => $latestMessages,
        ]);
    }

    private function getRecentSessions(CarbonImmutable $start): Collection
    {
        return DB::table('sessions')
            ->select(['id', 'user_id', 'ip_address', 'user_agent', 'last_activity'])
            ->where('last_activity', '>=', $start->timestamp)
            ->orderByDesc('last_activity')
            ->get()
            ->map(function (object $session) {
                $session->activity_at = CarbonImmutable::createFromTimestamp(
                    (int) $session->last_activity,
                    config('app.timezone')
                );

                return $session;
            });
    }

    private function buildTimelineFromSessions(Collection $sessions, CarbonImmutable $start, int $days): array
    {
        return $this->baseTimeline($start, $days)->map(function (array $point) use ($sessions) {
            $count = $sessions->filter(
                fn (object $session) => $session->activity_at->toDateString() === $point['date']
            )->count();

            return [
                'date' => $point['date'],
                'label' => $point['label'],
                'value' => $count,
            ];
        })->values()->all();
    }

    private function buildTimelineFromModel($query, string $column, CarbonImmutable $start, int $days): array
    {
        $rows = $query
            ->where($column, '>=', $start)
            ->get([$column])
            ->map(function (object $item) use ($column) {
                return optional($item->{$column})->toDateString();
            })
            ->filter();

        return $this->baseTimeline($start, $days)->map(function (array $point) use ($rows) {
            return [
                'date' => $point['date'],
                'label' => $point['label'],
                'value' => $rows->filter(fn (string $date) => $date === $point['date'])->count(),
            ];
        })->values()->all();
    }

    private function baseTimeline(CarbonImmutable $start, int $days): Collection
    {
        return collect(range(0, $days - 1))->map(function (int $offset) use ($start) {
            $day = $start->addDays($offset);

            return [
                'date' => $day->toDateString(),
                'label' => Str::ucfirst($day->translatedFormat('d M')),
            ];
        });
    }

    private function countByLabel(Collection $items, callable $resolver): array
    {
        $counts = $items
            ->map($resolver)
            ->filter()
            ->countBy()
            ->sortDesc();

        $total = max($counts->sum(), 1);

        return $counts
            ->map(fn (int $value, string $label) => [
                'label' => $label,
                'value' => $value,
                'percentage' => round(($value / $total) * 100, 1),
            ])
            ->values()
            ->all();
    }

    private function topLabel(array $items, string $fallback): string
    {
        return $items[0]['label'] ?? $fallback;
    }

    private function calculateGrowth(int $current, int $previous): array
    {
        if ($previous === 0) {
            return [
                'percentage' => $current > 0 ? 100 : 0,
                'direction' => $current > 0 ? 'up' : 'neutral',
                'label' => $current > 0 ? 'Arranque inicial' : 'Sin variación',
            ];
        }

        $difference = $current - $previous;
        $percentage = round((abs($difference) / $previous) * 100, 1);

        if ($difference > 0) {
            return [
                'percentage' => $percentage,
                'direction' => 'up',
                'label' => 'Más tráfico que la semana anterior',
            ];
        }

        if ($difference < 0) {
            return [
                'percentage' => $percentage,
                'direction' => 'down',
                'label' => 'Menos tráfico que la semana anterior',
            ];
        }

        return [
            'percentage' => 0,
            'direction' => 'neutral',
            'label' => 'Mismo nivel que la semana anterior',
        ];
    }

    private function topNetworks(Collection $sessions): array
    {
        $grouped = $sessions
            ->map(function (object $session) {
                return $this->maskIp($session->ip_address);
            })
            ->filter()
            ->countBy()
            ->sortDesc()
            ->take(5);

        return $grouped
            ->map(function (int $value, string $label) {
                return [
                    'label' => $label,
                    'value' => $value,
                ];
            })
            ->values()
            ->all();
    }

    private function maskIp(?string $ip): ?string
    {
        if (! $ip) {
            return null;
        }

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            $segments = explode('.', $ip);
            $segments[3] = 'xxx';

            return implode('.', $segments);
        }

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            $segments = explode(':', $ip);

            return collect($segments)
                ->take(4)
                ->pad(6, 'xxxx')
                ->implode(':');
        }

        return $ip;
    }

    private function detectDevice(?string $userAgent): string
    {
        $agent = Str::lower($userAgent ?? '');

        if ($agent === '') {
            return 'Sin identificar';
        }

        if ($this->isBot($agent)) {
            return 'Automatizaciones';
        }

        if (
            str_contains($agent, 'ipad')
            || str_contains($agent, 'tablet')
            || str_contains($agent, 'playbook')
            || str_contains($agent, 'silk')
            || (str_contains($agent, 'android') && ! str_contains($agent, 'mobile'))
        ) {
            return 'Tablet';
        }

        if (
            str_contains($agent, 'mobile')
            || str_contains($agent, 'iphone')
            || str_contains($agent, 'ipod')
            || str_contains($agent, 'android')
            || str_contains($agent, 'opera mini')
        ) {
            return 'Móvil';
        }

        return 'Escritorio';
    }

    private function detectBrowser(?string $userAgent): string
    {
        $agent = Str::lower($userAgent ?? '');

        if ($agent === '') {
            return 'Sin identificar';
        }

        if (str_contains($agent, 'edg')) {
            return 'Edge';
        }

        if (str_contains($agent, 'opr') || str_contains($agent, 'opera')) {
            return 'Opera';
        }

        if (str_contains($agent, 'firefox')) {
            return 'Firefox';
        }

        if (str_contains($agent, 'samsungbrowser')) {
            return 'Samsung Internet';
        }

        if (str_contains($agent, 'chrome') || str_contains($agent, 'crios')) {
            return 'Chrome';
        }

        if (str_contains($agent, 'safari')) {
            return 'Safari';
        }

        return 'Otro navegador';
    }

    private function detectOs(?string $userAgent): string
    {
        $agent = Str::lower($userAgent ?? '');

        if ($agent === '') {
            return 'Sin identificar';
        }

        if (str_contains($agent, 'windows')) {
            return 'Windows';
        }

        if (str_contains($agent, 'iphone') || str_contains($agent, 'ipad') || str_contains($agent, 'ios')) {
            return 'iOS';
        }

        if (str_contains($agent, 'android')) {
            return 'Android';
        }

        if (str_contains($agent, 'mac os x') || str_contains($agent, 'macintosh')) {
            return 'macOS';
        }

        if (str_contains($agent, 'linux')) {
            return 'Linux';
        }

        return 'Otro sistema';
    }

    private function isBot(string $agent): bool
    {
        return str_contains($agent, 'bot')
            || str_contains($agent, 'crawl')
            || str_contains($agent, 'spider')
            || str_contains($agent, 'slurp')
            || str_contains($agent, 'headless');
    }
}
