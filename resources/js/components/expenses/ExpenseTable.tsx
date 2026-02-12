import { Link, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import CategoryBadge from '@/components/CategoryBadge';
import ConfirmDialog from '@/components/ConfirmDialog';
import type { Expense } from '@/types';

interface ExpenseTableProps {
    expenses: Expense[];
    showActions?: boolean;
}

export default function ExpenseTable({ expenses, showActions = false }: ExpenseTableProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteId) return;
        setDeleting(true);
        router.delete(`/expenses/${deleteId}`, {
            onFinish: () => {
                setDeleting(false);
                setDeleteId(null);
            },
        });
    };

    if (expenses.length === 0) {
        return (
            <div className="py-12 text-center text-sm text-gray-500">
                No expenses found.
            </div>
        );
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        {showActions && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                            <TableCell className="whitespace-nowrap text-sm text-gray-500">
                                {new Date(expense.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-medium">
                                {expense.description}
                            </TableCell>
                            <TableCell>
                                {expense.category && (
                                    <CategoryBadge category={expense.category} />
                                )}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                                ${parseFloat(expense.amount).toFixed(2)}
                            </TableCell>
                            {showActions && (
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href={`/expenses/${expense.id}/edit`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteId(expense.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <ConfirmDialog
                open={deleteId !== null}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Expense"
                description="Are you sure you want to delete this expense? This action cannot be undone."
                loading={deleting}
            />
        </>
    );
}
