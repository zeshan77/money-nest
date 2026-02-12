<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Food',
                'slug' => 'food',
                'icon' => 'utensils',
                'color' => 'orange',
                'children' => [
                    ['name' => 'Restaurants', 'slug' => 'restaurants', 'icon' => 'utensils-crossed', 'color' => 'orange'],
                    ['name' => 'Oil', 'slug' => 'oil', 'icon' => 'amphora', 'color' => 'orange']
                ],
            ],
            [
                'name' => 'Transport',
                'slug' => 'transport',
                'icon' => 'car',
                'color' => 'blue',
                'children' => [
                    ['name' => 'Bus', 'slug' => 'bus', 'icon' => 'bus', 'color' => 'blue'],
                    ['name' => 'Taxi', 'slug' => 'taxi', 'icon' => 'car-taxi-front', 'color' => 'blue'],
                    ['name' => 'Fuel', 'slug' => 'fuel', 'icon' => 'fuel', 'color' => 'blue'],
                ],
            ],
            [
                'name' => 'Education',
                'slug' => 'education',
                'icon' => 'graduation-cap',
                'color' => 'green',
            ],
            [
                'name' => 'Shopping',
                'slug' => 'shopping',
                'icon' => 'shopping-bag',
                'color' => 'pink',
                'children' => [
                    ['name' => 'Clothes', 'slug' => 'clothes', 'icon' => 'shirt', 'color' => 'pink'],
                    ['name' => 'Electronics', 'slug' => 'electronics', 'icon' => 'smartphone', 'color' => 'pink'],
                ],
            ],
            [
                'name' => 'Health',
                'slug' => 'health',
                'icon' => 'heart-pulse',
                'color' => 'red',
            ],
            [
                'name' => 'Bills',
                'slug' => 'bills',
                'icon' => 'receipt-text',
                'color' => 'yellow',
                'children' => [
                    ['name' => 'Internet', 'slug' => 'internet', 'icon' => 'wifi', 'color' => 'yellow'],
                    ['name' => 'Electricity', 'slug' => 'electricity', 'icon' => 'plug', 'color' => 'yellow'],
                    ['name' => 'Water', 'slug' => 'water', 'icon' => 'droplet', 'color' => 'yellow'],
                    ['name' => 'Mobile', 'slug' => 'mobile', 'icon' => 'card-sim', 'color' => 'purple'],
                ],
            ],
            [
                'name' => 'Charity',
                'slug' => 'charity',
                'icon' => 'heart-handshake',
                'color' => 'yellow',
                'children' => [
                    ['name' => 'Idara', 'slug' => 'idara', 'icon' => 'hand-helping', 'color' => 'yellow'],
                ],
            ],

            [
                'name' => 'Other',
                'slug' => 'other',
                'icon' => 'ellipsis',
                'color' => 'gray',
            ],
        ];

        foreach ($categories as $categoryData) {
            $children = $categoryData['children'] ?? [];
            unset($categoryData['children']);

            $parent = Category::create($categoryData);

            foreach ($children as $child) {
                $parent->children()->create($child);
            }
        }
    }
}
