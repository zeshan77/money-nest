# Money Nest - Daily Expense Management App

## Context

Build a family expense tracking application for a parent and 4 children. Each family member has their own account with Passkey (biometric) login and PIN fallback. The parent can see everyone's expenses; children only see their own. The app needs a full dashboard with charts, category breakdowns, and daily/weekly/monthly summaries.

**Stack:** Laravel 12 + Inertia.js + React (TypeScript) + Tailwind CSS v4 + shadcn/ui + SQLite

---

## Phase 1: Database Schema & Models

### 1.1 Create `UserRole` enum
- **New file:** `app/Enums/UserRole.php`
- Values: `Parent = 'parent'`, `Child = 'child'`

### 1.2 Migration: Add `pin` and `role` to users table
- **New file:** `database/migrations/xxxx_add_pin_and_role_to_users_table.php`
- Add `pin` (string, hashed), `role` (string, default `child`)
- Make `email` and `password` nullable (passkey/PIN auth, no email needed)

### 1.2b Migration: Create `webauthn_credentials` table (for Passkeys)
- **New file:** `database/migrations/xxxx_create_webauthn_credentials_table.php`
- Columns: `id` (string, credential ID from WebAuthn), `user_id` (FK), `public_key` (text), `name` (string — e.g. "Ahmed's iPhone"), `counter` (unsigned integer, for replay protection), `timestamps`
- A user can have multiple passkeys (one per device)

### 1.3 Migration: Create `categories` table (hierarchical with subcategories)
- **New file:** `database/migrations/xxxx_create_categories_table.php`
- Columns: `id`, `parent_id` (nullable FK self-referencing), `name`, `slug`, `icon` (lucide icon name), `color` (tailwind color), `timestamps`
- Top-level categories have `parent_id = null`; subcategories reference their parent
- Example: Food (parent) → Groceries, Dining Out, Snacks (children)

### 1.4 Migration: Create `expenses` table
- **New file:** `database/migrations/xxxx_create_expenses_table.php`
- Columns: `id`, `user_id` (FK — the member the expense belongs to), `created_by` (FK — the member who added it), `category_id` (FK), `amount` (decimal 10,2), `description`, `date`, `timestamps`
- `user_id` = whose expense it is; `created_by` = who entered it (allows adding expenses on behalf of others)
- Indexes on `[user_id, date]` and `[category_id]`

### 1.5 Models
- **Modify:** `app/Models/User.php` — add `pin`, `role` to fillable/hidden/casts; add `expenses()` hasMany (expenses belonging to this user); add `createdExpenses()` hasMany (expenses this user entered for others); add `webauthnCredentials()` hasMany; add `isParent()` helper
- **New file:** `app/Models/WebauthnCredential.php` — fillable: id, user_id, public_key, name, counter; belongsTo User; `$incrementing = false` (string ID from WebAuthn)
- **New file:** `app/Models/Category.php` — fillable: parent_id, name, slug, icon, color; `parent()` belongsTo self, `children()` hasMany self, `expenses()` hasMany; `isParent()` helper (parent_id is null)
- **New file:** `app/Models/Expense.php` — fillable: user_id, created_by, category_id, amount, description, date; `user()` belongsTo (owner), `creator()` belongsTo User (who added it), `category()` belongsTo

### 1.6 Seeders
- **New file:** `database/seeders/CategorySeeder.php` — 7 parent categories (Food, Transport, Entertainment, Education, Shopping, Health, Other) each with 2-3 subcategories (e.g. Food → Groceries, Dining Out, Snacks; Transport → Fuel, Public Transit, Ride Share)
- **Modify:** `database/seeders/DatabaseSeeder.php` — seed parent (PIN: 1234) + 4 children (Ahmed/1111, Sara/2222, Ali/3333, Hana/4444) + sample expenses for last 30 days
- **Modify:** `database/factories/UserFactory.php` — add pin, role fields
- **New file:** `database/factories/ExpenseFactory.php`

---

## Phase 2: Authentication (Passkeys + PIN fallback)

### 2.1 Install WebAuthn server library
- `composer require web-auth/webauthn-lib` — PHP library for WebAuthn server-side operations (challenge generation, credential verification). SQLite-compatible, no extra DB drivers needed.

### 2.2 Auth controller (PIN fallback)
- **New file:** `app/Http/Controllers/AuthController.php`
- `showLogin()` — fetch all users (id, name, role) + whether each has passkeys registered, render `Auth/Login` page
- `loginWithPin()` — validate user_id + 4-digit PIN, `Hash::check()`, `Auth::login($user)` (fallback method)
- `logout()` — standard session invalidation

### 2.3 WebAuthn controller (Passkeys)
- **New file:** `app/Http/Controllers/WebAuthnController.php`
- **Registration (one-time setup per device):**
  - `registerOptions(Request $request)` — generate WebAuthn registration challenge for the authenticated user, return as JSON
  - `register(Request $request)` — verify the registration response, store credential in `webauthn_credentials` table
- **Authentication (login):**
  - `loginOptions(Request $request)` — generate WebAuthn authentication challenge for a selected user, return as JSON
  - `login(Request $request)` — verify the authentication response, update counter, `Auth::login($user)`

### 2.4 Parent-only middleware
- **New file:** `app/Http/Middleware/EnsureIsParent.php` — abort 403 if not parent role
- **Modify:** `bootstrap/app.php` — register `parent` middleware alias

### 2.5 Share auth data via Inertia
- **Modify:** `app/Http/Middleware/HandleInertiaRequests.php` — share `auth.user` (id, name, role, isParent) and `flash` (success, error) to all pages

---

## Phase 3: Backend Controllers & Routes

### 3.1 Routes
- **Modify:** `routes/web.php`
  - `GET /` — Welcome page
  - Guest: `GET /login`, `POST /login/pin` (PIN fallback), `POST /webauthn/login/options` (get challenge), `POST /webauthn/login` (verify passkey)
  - Auth: `POST /logout`, `GET /dashboard`, resource `expenses` (except show), `POST /webauthn/register/options` (get registration challenge), `POST /webauthn/register` (store passkey), parent-only: `GET /family`, `GET /family/{user}`

### 3.2 Dashboard controller
- **New file:** `app/Http/Controllers/DashboardController.php`
- `index()` — personal dashboard: today/week/month totals, category breakdown (pie chart), daily totals last 30 days (bar chart), recent 10 expenses
- `family()` — parent only: all members with monthly totals, family category breakdown, family daily totals
- `memberDetail(User $user)` — parent only: specific member's monthly expenses and category breakdown

### 3.3 Expense controller
- **New file:** `app/Http/Controllers/ExpenseController.php` — standard resource (index, create, store, edit, update, destroy), scoped to authenticated user. `create()` and `edit()` pass list of all family members so the "For" dropdown can be populated. `store()` sets `created_by` to the authenticated user.

### 3.4 Form requests
- **New file:** `app/Http/Requests/StoreExpenseRequest.php` — validate user_id (exists in users, the member this expense is for), category_id, amount (min 0.01), description, date (not future). `created_by` is set automatically to `auth()->id()` in the controller.
- **New file:** `app/Http/Requests/UpdateExpenseRequest.php` — same rules

### 3.5 Policy
- **New file:** `app/Policies/ExpensePolicy.php` — parent can view/update/delete any; children only their own

---

## Phase 4: Frontend Setup

### 4.1 Install dependencies
- `npm install recharts @simplewebauthn/browser` (charting + WebAuthn browser API helper)
- `composer require web-auth/webauthn-lib` (WebAuthn server-side)
- `npx shadcn@latest add button card input label select table badge avatar separator dropdown-menu dialog toast`

### 4.2 TypeScript types
- **New file:** `resources/js/types/index.ts` — interfaces for User, Category (with optional `children` array and `parent_id`), Expense (with `user_id`, `created_by`, optional `creator` relation), PaginatedData, DashboardSummary, CategoryBreakdownItem, DailyTotal, FamilyMember, PageProps

---

## Phase 5: Frontend Layouts & Components

### 5.1 Layouts
- **New file:** `resources/js/layouts/AppLayout.tsx` — sidebar nav (Dashboard, My Expenses, Family [parent only]), header with user name + logout, flash message toasts
- **New file:** `resources/js/layouts/GuestLayout.tsx` — centered card layout for login

### 5.2 Reusable components
- **New file:** `resources/js/components/PinInput.tsx` — 4-digit PIN input with auto-focus advance (used as fallback auth)
- **New file:** `resources/js/components/PasskeyButton.tsx` — triggers WebAuthn registration or authentication via `@simplewebauthn/browser`; shows fingerprint icon
- **New file:** `resources/js/components/SummaryCard.tsx` — metric card (label, value, icon)
- **New file:** `resources/js/components/CategoryBadge.tsx` — category name + icon + color badge
- **New file:** `resources/js/components/ConfirmDialog.tsx` — delete confirmation dialog
- **New file:** `resources/js/components/expenses/ExpenseForm.tsx` — shared form for create/edit; includes a "For" select dropdown to pick which family member the expense is for (defaults to self), and a grouped category select showing parent categories with their subcategories
- **New file:** `resources/js/components/expenses/ExpenseTable.tsx` — reusable expense table
- **New file:** `resources/js/components/charts/CategoryPieChart.tsx` — recharts PieChart in a Card
- **New file:** `resources/js/components/charts/DailySpendingChart.tsx` — recharts BarChart/AreaChart in a Card
- **New file:** `resources/js/components/charts/MemberComparisonChart.tsx` — recharts BarChart comparing members

---

## Phase 6: Frontend Pages

### 6.1 Auth
- **New file:** `resources/js/pages/Auth/Login.tsx` — grid of user cards; tap a name → if user has passkeys, trigger biometric prompt via `@simplewebauthn/browser`; if no passkeys or user clicks "Use PIN instead", show PIN dialog as fallback. Shows a fingerprint icon badge on users who have passkeys registered.

### 6.2 Dashboard
- **New file:** `resources/js/pages/Dashboard.tsx` — summary cards (today/week/month), category pie chart, daily spending chart, recent expenses table

### 6.3 Expenses
- **New file:** `resources/js/pages/Expenses/Index.tsx` — paginated expense table with edit/delete actions, "Add Expense" button
- **New file:** `resources/js/pages/Expenses/Create.tsx` — expense form with "For" member select (defaults to self), grouped category select (parent → subcategories), amount, description, date
- **New file:** `resources/js/pages/Expenses/Edit.tsx` — pre-populated expense form with same fields

### 6.4 Family (parent only)
- **New file:** `resources/js/pages/Family/Index.tsx` — family total card, member cards grid with monthly totals, family category pie chart, daily spending chart, member comparison chart
- **New file:** `resources/js/pages/Family/MemberDetail.tsx` — individual member's expenses, category breakdown, monthly total

### 6.5 Update existing
- **Modify:** `resources/js/pages/Welcome.tsx` — landing page with login link, redirect if already authenticated

---

## File Summary

**New files (38):**
| Area | Files |
|------|-------|
| Enums | `app/Enums/UserRole.php` |
| Migrations | 4 migration files (users update, categories, expenses, webauthn_credentials) |
| Models | `Category.php`, `Expense.php`, `WebauthnCredential.php` |
| Controllers | `AuthController.php`, `WebAuthnController.php`, `DashboardController.php`, `ExpenseController.php` |
| Middleware | `EnsureIsParent.php` |
| Requests | `StoreExpenseRequest.php`, `UpdateExpenseRequest.php` |
| Policies | `ExpensePolicy.php` |
| Seeders/Factories | `CategorySeeder.php`, `ExpenseFactory.php` |
| TS Types | `resources/js/types/index.ts` |
| Layouts | `AppLayout.tsx`, `GuestLayout.tsx` |
| Components | 10 reusable components (PinInput, PasskeyButton, SummaryCard, CategoryBadge, ConfirmDialog, ExpenseForm, ExpenseTable, 3 charts) |
| Pages | 7 pages (Login, Dashboard, Expenses x3, Family x2) |

**Modified files (7):** `User.php`, `bootstrap/app.php`, `HandleInertiaRequests.php`, `web.php`, `DatabaseSeeder.php`, `UserFactory.php`, `Welcome.tsx`

---

## Verification

1. Run `php artisan migrate:fresh --seed` — verify tables created and seeded
2. Run `npm run build` — verify frontend compiles without errors
3. Run `php artisan serve` + `npm run dev` — visit `/login`, select a user, enter PIN (fallback)
4. Log in as a user, register a passkey (fingerprint/Face ID), log out, then log back in using the passkey
5. As child: verify dashboard shows only own expenses, cannot access `/family`
5. As parent: verify dashboard shows own expenses, `/family` shows all members
6. Test expense CRUD: create, edit, delete an expense
7. Test adding an expense on behalf of another family member — verify it shows on the other member's dashboard
8. Test category hierarchy: verify subcategories display grouped under parent categories in the form
9. Verify charts render with seeded data on dashboard and family pages
