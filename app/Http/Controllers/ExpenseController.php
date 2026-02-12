<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Models\Category;
use App\Models\Expense;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $expenses = Auth::user()->expenses()
            ->with('category.parent')
            ->latest('date')
            ->latest('id')
            ->paginate(15);

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Expenses/Create', [
            'categories' => Category::query()
                ->whereNull('parent_id')
                ->with('children')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(StoreExpenseRequest $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validated();
        $userId = $validated['user_id'] ?? Auth::id();
        unset($validated['user_id']);

        Expense::create([
            ...$validated,
            'user_id' => $userId,
        ]);

        return redirect()->route('expenses.index')
            ->with('success', 'Expense added successfully.');
    }

    public function edit(Expense $expense): Response
    {
        $this->authorize('update', $expense);

        return Inertia::render('Expenses/Edit', [
            'expense' => $expense->load('category.parent'),
            'categories' => Category::query()
                ->whereNull('parent_id')
                ->with('children')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function update(UpdateExpenseRequest $request, Expense $expense): \Illuminate\Http\RedirectResponse
    {
        $this->authorize('update', $expense);

        $validated = $request->validated();
        $userId = $validated['user_id'] ?? $expense->user_id;
        unset($validated['user_id']);

        $expense->update([
            ...$validated,
            'user_id' => $userId,
        ]);

        return redirect()->route('expenses.index')
            ->with('success', 'Expense updated successfully.');
    }

    public function destroy(Expense $expense): \Illuminate\Http\RedirectResponse
    {
        $this->authorize('delete', $expense);

        $expense->delete();

        return redirect()->route('expenses.index')
            ->with('success', 'Expense deleted successfully.');
    }
}
