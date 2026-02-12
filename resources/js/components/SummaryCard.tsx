import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    className?: string;
}

export default function SummaryCard({ label, value, icon: Icon, className }: SummaryCardProps) {
    return (
        <Card className={className}>
            <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-lg bg-green-50 p-3">
                    <Icon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}
