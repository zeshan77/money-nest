import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import type { Category } from '@/types';

interface Props {
    categories: Category[];
}

export default function ExpensesCreate({ categories }: Props) {
    return (
        <AppLayout>
            <Head title="Add Expense" />
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
                <ExpenseForm categories={categories} />
            </div>
        </AppLayout>
    );
}
