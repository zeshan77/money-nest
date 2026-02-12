<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $todayTotal = $user->expenses()
            ->whereDate('date', today())
            ->sum('amount');

        $weekTotal = $user->expenses()
            ->whereBetween('date', [now()->startOfWeek(), now()->endOfWeek()])
            ->sum('amount');

        $monthTotal = $user->expenses()
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('amount');

        $categoryBreakdown = $this->getCategoryBreakdown($user->expenses()
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year));

        $dailyTotals = $user->expenses()
            ->whereBetween('date', [now()->subDays(29), now()])
            ->select(DB::raw('date'), DB::raw('SUM(amount) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'date' => $item->date->format('M d'),
                'total' => (float) $item->total,
            ]);

        $recentExpenses = $user->expenses()
            ->with('category.parent')
            ->latest('date')
            ->latest('id')
            ->limit(10)
            ->get();

        return Inertia::render('Dashboard', [
            'summary' => [
                'todayTotal' => (float) $todayTotal,
                'weekTotal' => (float) $weekTotal,
                'monthTotal' => (float) $monthTotal,
            ],
            'categoryBreakdown' => $categoryBreakdown,
            'dailyTotals' => $dailyTotals,
            'recentExpenses' => $recentExpenses,
        ]);
    }

    public function family(): Response
    {
        $members = User::query()
            ->withSum([
                'expenses as month_total' => function ($query) {
                    $query->whereMonth('date', now()->month)
                        ->whereYear('date', now()->year);
                },
            ], 'amount')
            ->orderByRaw("CASE WHEN role = 'parent' THEN 0 ELSE 1 END")
            ->orderBy('name')
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role->value,
                'monthTotal' => (float) ($user->month_total ?? 0),
            ]);

        $familyMonthTotal = Expense::query()
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('amount');

        $familyCategoryBreakdown = $this->getCategoryBreakdown(Expense::query()
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year));

        $familyDailyTotals = Expense::query()
            ->whereBetween('date', [now()->subDays(29), now()])
            ->select(DB::raw('date'), DB::raw('SUM(amount) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'date' => \Carbon\Carbon::parse($item->date)->format('M d'),
                'total' => (float) $item->total,
            ]);

        $memberComparison = User::query()
            ->withSum([
                'expenses as month_total' => function ($query) {
                    $query->whereMonth('date', now()->month)
                        ->whereYear('date', now()->year);
                },
            ], 'amount')
            ->get()
            ->map(fn ($user) => [
                'name' => $user->name,
                'total' => (float) ($user->month_total ?? 0),
            ]);

        return Inertia::render('Family/Index', [
            'members' => $members,
            'familyMonthTotal' => (float) $familyMonthTotal,
            'familyCategoryBreakdown' => $familyCategoryBreakdown,
            'familyDailyTotals' => $familyDailyTotals,
            'memberComparison' => $memberComparison,
        ]);
    }

    public function memberDetail(User $user): Response
    {
        $monthTotal = $user->expenses()
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('amount');

        $categoryBreakdown = $this->getCategoryBreakdown($user->expenses()
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year));

        $recentExpenses = $user->expenses()
            ->with('category.parent')
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->latest('date')
            ->latest('id')
            ->get();

        return Inertia::render('Family/MemberDetail', [
            'member' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role->value,
            ],
            'monthTotal' => (float) $monthTotal,
            'categoryBreakdown' => $categoryBreakdown,
            'recentExpenses' => $recentExpenses,
        ]);
    }

    private function getCategoryBreakdown(Builder|Relations\HasMany $query): Collection
    {
        return $query
            ->join('categories', 'expenses.category_id', '=', 'categories.id')
            ->leftJoin('categories as parent_categories', 'categories.parent_id', '=', 'parent_categories.id')
            ->select(
                DB::raw('COALESCE(parent_categories.name, categories.name) as name'),
                DB::raw('COALESCE(parent_categories.slug, categories.slug) as slug'),
                DB::raw('COALESCE(parent_categories.icon, categories.icon) as icon'),
                DB::raw('COALESCE(parent_categories.color, categories.color) as color'),
                DB::raw('SUM(expenses.amount) as total'),
            )
            ->groupByRaw('COALESCE(parent_categories.name, categories.name), COALESCE(parent_categories.slug, categories.slug), COALESCE(parent_categories.icon, categories.icon), COALESCE(parent_categories.color, categories.color)')
            ->orderByDesc('total')
            ->get();
    }
}
