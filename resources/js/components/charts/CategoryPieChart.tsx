import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CategoryBreakdownItem } from '@/types';

const COLORS: Record<string, string> = {
    orange: '#f97316',
    blue: '#3b82f6',
    purple: '#a855f7',
    green: '#22c55e',
    pink: '#ec4899',
    red: '#ef4444',
    gray: '#6b7280',
};

interface CategoryPieChartProps {
    data: CategoryBreakdownItem[];
    title?: string;
}

export default function CategoryPieChart({ data, title = 'Spending by Category' }: CategoryPieChartProps) {
    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="flex h-64 items-center justify-center text-sm text-gray-500">
                    No data for this period.
                </CardContent>
            </Card>
        );
    }

    const chartData = data.map((item) => ({
        name: item.name,
        value: parseFloat(String(item.total)),
        color: COLORS[item.color] || COLORS.gray,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={4}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => [`PKR ${value.toFixed(2)}`, 'Amount']}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
