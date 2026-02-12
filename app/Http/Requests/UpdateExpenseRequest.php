<?php

namespace App\Http\Requests;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;

class UpdateExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id', function (string $attribute, mixed $value, \Closure $fail) {
                $category = Category::find($value);
                if ($category && $category->children()->exists()) {
                    $fail('You must select a subcategory, not a parent category.');
                }
            }],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'description' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date', 'before_or_equal:today'],
            'user_id' => ['nullable', 'exists:users,id'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'amount.min' => 'The amount must be at least 0.01.',
            'date.before_or_equal' => 'The date cannot be in the future.',
        ];
    }
}
