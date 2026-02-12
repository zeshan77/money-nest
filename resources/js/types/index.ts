export interface User {
    id: number;
    name: string;
    role: 'parent' | 'child';
    isParent: boolean;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    color: string;
    parent_id: number | null;
    children?: Category[];
    parent?: Category;
}

export interface Expense {
    id: number;
    user_id: number;
    category_id: number;
    amount: string;
    description: string;
    date: string;
    created_at: string;
    updated_at: string;
    category?: Category;
    user?: User;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DashboardSummary {
    todayTotal: number;
    weekTotal: number;
    monthTotal: number;
}

export interface CategoryBreakdownItem {
    name: string;
    slug: string;
    icon: string;
    color: string;
    total: number;
}

export interface DailyTotal {
    date: string;
    total: number;
}

export interface FamilyMember {
    id: number;
    name: string;
    role: 'parent' | 'child';
    monthTotal: number;
}

export interface MemberComparison {
    name: string;
    total: number;
}

export interface PageProps {
    auth: {
        user: User | null;
        users: Pick<User, 'id' | 'name'>[];
    };
    flash: {
        success: string | null;
        error: string | null;
    };
}
