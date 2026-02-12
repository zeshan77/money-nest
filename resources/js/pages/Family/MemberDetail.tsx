import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout';
import SummaryCard from '@/components/SummaryCard';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import ExpenseTable from '@/components/expenses/ExpenseTable';
import type { CategoryBreakdownItem, Expense } from '@/types';

interface Props {
    member: {
        id: number;
        name: string;
        role: string;
    };
    monthTotal: number;
    categoryBreakdown: CategoryBreakdownItem[];
    recentExpenses: Expense[];
}

export default function MemberDetail({
    member,
    monthTotal,
    categoryBreakdown,
    recentExpenses,
}: Props) {
    return (
        <AppLayout>
            <Head title={`${member.name}'s Expenses`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/family">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {member.name}'s Expenses
                    </h1>
                </div>

                <SummaryCard
                    label="Monthly Total"
                    value={`$${monthTotal.toFixed(2)}`}
                    icon={CalendarRange}
                />

                <div className="grid gap-6 lg:grid-cols-2">
                    <CategoryPieChart
                        data={categoryBreakdown}
                        title={`${member.name}'s Categories`}
                    />
                    <Card>
                        <CardHeader>
                            <CardTitle>This Month's Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ExpenseTable expenses={recentExpenses} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
