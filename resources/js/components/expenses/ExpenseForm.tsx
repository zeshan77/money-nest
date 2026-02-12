import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Category, Expense, PageProps } from '@/types';

interface ExpenseFormProps {
    categories: Category[];
    expense?: Expense;
}

export default function ExpenseForm({ categories, expense }: ExpenseFormProps) {
    const { auth } = usePage<PageProps>().props;
    const isEditing = !!expense;

    const { data, setData, post, put, processing, errors } = useForm({
        category_id: expense?.category_id?.toString() || '',
        amount: expense?.amount || '',
        description: expense?.description || '',
        date: expense?.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0],
        user_id: expense?.user_id?.toString() || auth.user?.id.toString() || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/expenses/${expense.id}`);
        } else {
            post('/expenses');
        }
    };

    return (
        <Card className="mx-auto max-w-lg">
            <CardHeader>
                <CardTitle>{isEditing ? 'Edit Expense' : 'Add Expense'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="user_id">For</Label>
                        <Select
                            value={data.user_id}
                            onValueChange={(value) => setData('user_id', value)}
                        >
                            <SelectTrigger id="user_id">
                                <SelectValue placeholder="Select a person" />
                            </SelectTrigger>
                            <SelectContent>
                                {auth.users.map((user) => (
                                    <SelectItem
                                        key={user.id}
                                        value={user.id.toString()}
                                    >
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.user_id && (
                            <p className="text-sm text-red-600">{errors.user_id}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category_id">Category</Label>
                        <Select
                            value={data.category_id}
                            onValueChange={(value) => setData('category_id', value)}
                        >
                            <SelectTrigger id="category_id">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) =>
                                    category.children && category.children.length > 0 ? (
                                        <SelectGroup key={category.id}>
                                            <SelectLabel>{category.name}</SelectLabel>
                                            {category.children.map((child) => (
                                                <SelectItem
                                                    key={child.id}
                                                    value={child.id.toString()}
                                                >
                                                    {child.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    ) : (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                        {errors.category_id && (
                            <p className="text-sm text-red-600">{errors.category_id}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            placeholder="0.00"
                        />
                        {errors.amount && (
                            <p className="text-sm text-red-600">{errors.amount}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="What did you spend on?"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                        />
                        {errors.date && (
                            <p className="text-sm text-red-600">{errors.date}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700">
                            {processing
                                ? 'Saving...'
                                : isEditing
                                  ? 'Update Expense'
                                  : 'Add Expense'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
