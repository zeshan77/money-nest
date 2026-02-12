import { Head, Link } from '@inertiajs/react';
import { CalendarRange, Shield, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout';
import SummaryCard from '@/components/SummaryCard';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import DailySpendingChart from '@/components/charts/DailySpendingChart';
import MemberComparisonChart from '@/components/charts/MemberComparisonChart';
import type {
    FamilyMember,
    CategoryBreakdownItem,
    DailyTotal,
    MemberComparison,
} from '@/types';

interface Props {
    members: FamilyMember[];
    familyMonthTotal: number;
    familyCategoryBreakdown: CategoryBreakdownItem[];
    familyDailyTotals: DailyTotal[];
    memberComparison: MemberComparison[];
}

export default function FamilyIndex({
    members,
    familyMonthTotal,
    familyCategoryBreakdown,
    familyDailyTotals,
    memberComparison,
}: Props) {
    return (
        <AppLayout>
            <Head title="Family Overview" />

            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Family Overview
                </h1>

                {/* Family total */}
                <SummaryCard
                    label="Family Total (This Month)"
                    value={`PKR ${familyMonthTotal.toFixed(2)}`}
                    icon={CalendarRange}
                />

                {/* Member cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {members.map((member) => (
                        <Link key={member.id} href={`/family/${member.id}`}>
                            <Card className="transition-all hover:shadow-md hover:ring-2 hover:ring-green-500">
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                            member.role === 'parent'
                                                ? 'bg-green-100'
                                                : 'bg-blue-100'
                                        }`}
                                    >
                                        {member.role === 'parent' ? (
                                            <Shield className="h-6 w-6 text-green-600" />
                                        ) : (
                                            <UserIcon className="h-6 w-6 text-blue-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{member.name}</p>
                                        <p className="text-sm text-gray-500">
                                            PKR {member.monthTotal.toFixed(2)} this month
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <CategoryPieChart
                        data={familyCategoryBreakdown}
                        title="Family Spending by Category"
                    />
                    <MemberComparisonChart data={memberComparison} />
                </div>

                <DailySpendingChart
                    data={familyDailyTotals}
                    title="Family Daily Spending (Last 30 Days)"
                />
            </div>
        </AppLayout>
    );
}
