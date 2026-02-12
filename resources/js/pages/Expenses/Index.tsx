import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout';
import ExpenseTable from '@/components/expenses/ExpenseTable';
import type { Expense, PaginatedData } from '@/types';

interface Props {
    expenses: PaginatedData<Expense>;
}

export default function ExpensesIndex({ expenses }: Props) {
    console.log('consoling expenses', expenses);
    return (
        <AppLayout>
            <Head title="My Expenses" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        My Expenses
                    </h1>
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                        <Link href="/expenses/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Expense
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <ExpenseTable
                            expenses={expenses.data}
                            showActions
                        />
                    </CardContent>
                </Card>

                {/* Pagination */}
                {expenses.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {expenses.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                className={link.active ? 'bg-green-600 hover:bg-green-700' : ''}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
