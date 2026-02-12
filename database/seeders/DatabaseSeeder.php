<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Expense;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    private const DEFAULT_PARENT_PIN = '1489';

    /** @var array<string, string> */
    private const FAMILY_MEMBERS = [
        'children' => [
            ['name' => 'Faizan Khattak', 'pin' => '1111'],
            ['name' => 'Farhan Khattak', 'pin' => '2222'],
            ['name' => 'Javeria Zeshan', 'pin' => '3333'],
            ['name' => 'Bareera Zeshan', 'pin' => '4444'],
        ],
        'parents' => [
            ['name' => 'Khadija Zeshan'],
            ['name' => 'Zeshan Khattak'],
        ]
    ];

    public function run(): void
    {
        $this->call(CategorySeeder::class);

        $this->createFamilyMembers();
    }

    /**
     * Creates all family members including parents and children
     */
    private function createFamilyMembers(): void
    {
        $parents = collect(self::FAMILY_MEMBERS['parents'])
            ->map(fn (array $parent) => $this->createParent($parent['name']));

        $children = collect(self::FAMILY_MEMBERS['children'])
            ->map(fn (array $child) => $this->createChild($child['name'], $child['pin']));

        // Combine all users if needed for further processing
        $allFamilyMembers = $parents->merge($children);
    }

    /**
     * Creates a parent user with default PIN
     */
    private function createParent(string $name): User
    {
        return User::factory()
            ->parent()
            ->create([
                'name' => $name,
                'pin' => Hash::make(self::DEFAULT_PARENT_PIN),
            ]);
    }

    /**
     * Creates a child user with specified PIN
     */
    private function createChild(string $name, string $pin): User
    {
        return User::factory()->create([
            'name' => $name,
            'pin' => Hash::make($pin),
        ]);
    }

}
