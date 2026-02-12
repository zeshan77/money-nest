import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DailyTotal } from '@/types';

interface DailySpendingChartProps {
    data: DailyTotal[];
    title?: string;
}

export default function DailySpendingChart({ data, title = 'Daily Spending (Last 30 Days)' }: DailySpendingChartProps) {
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            fontSize={12}
                            tickLine={false}
                        />
                        <YAxis
                            fontSize={12}
                            tickLine={false}
                            tickFormatter={(value) => `PKR ${value}`}
                        />
                        <Tooltip
                            formatter={(value: number) => [`PKR ${value.toFixed(2)}`, 'Total']}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#16a34a"
                            fill="#bbf7d0"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
