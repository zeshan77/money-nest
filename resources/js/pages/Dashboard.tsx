import { Head } from '@inertiajs/react';
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout';
import SummaryCard from '@/components/SummaryCard';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import DailySpendingChart from '@/components/charts/DailySpendingChart';
import ExpenseTable from '@/components/expenses/ExpenseTable';
import type { DashboardSummary, CategoryBreakdownItem, DailyTotal, Expense } from '@/types';

interface Props {
    summary: DashboardSummary;
    categoryBreakdown: CategoryBreakdownItem[];
    dailyTotals: DailyTotal[];
    recentExpenses: Expense[];
}

function formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`;
}

export default function Dashboard({
    summary,
    categoryBreakdown,
    dailyTotals,
    recentExpenses,
}: Props) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

                {/* Summary cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <SummaryCard
                        label="Today"
                        value={formatCurrency(summary.todayTotal)}
                        icon={Calendar}
                    />
                    <SummaryCard
                        label="This Week"
                        value={formatCurrency(summary.weekTotal)}
                        icon={CalendarDays}
                    />
                    <SummaryCard
                        label="This Month"
                        value={formatCurrency(summary.monthTotal)}
                        icon={CalendarRange}
                    />
                </div>

                {/* Charts */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <CategoryPieChart data={categoryBreakdown} />
                    <DailySpendingChart data={dailyTotals} />
                </div>

                {/* Recent expenses */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ExpenseTable expenses={recentExpenses} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
