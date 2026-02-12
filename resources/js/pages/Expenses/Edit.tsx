import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import type { Category, Expense } from '@/types';

interface Props {
    expense: Expense;
    categories: Category[];
}

export default function ExpensesEdit({ expense, categories }: Props) {
    return (
        <AppLayout>
            <Head title="Edit Expense" />
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Edit Expense</h1>
                <ExpenseForm categories={categories} expense={expense} />
            </div>
        </AppLayout>
    );
}
