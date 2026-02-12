import { Link, router, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Receipt,
    Users,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { useState, useEffect, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { PageProps } from '@/types';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Expenses', href: '/expenses', icon: Receipt },
];

const parentNavigation = [
    { name: 'Family', href: '/family', icon: Users },
];

export default function AppLayout({ children }: { children: ReactNode }) {
    const { auth, flash } = usePage<PageProps>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const url = usePage().url;

    useEffect(() => {
        if (flash.success) {
            setToast(flash.success);
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    useEffect(() => {
        if (flash.error) {
            setToast(flash.error);
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash.error]);

    const allNav = auth.user?.isParent
        ? [...navigation, ...parentNavigation]
        : navigation;

    const isActive = (href: string) => url.startsWith(href);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-200 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center justify-between px-6">
                    <Link href="/dashboard" className="text-xl font-bold text-green-600">
                        Money Nest
                    </Link>
                    <button
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <Separator />
                <nav className="flex flex-col gap-1 p-4">
                    {allNav.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                isActive(item.href)
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 lg:px-8">
                    <button
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="ml-auto flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">
                            {auth.user?.name}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.post('/logout')}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">{children}</main>
            </div>

            {/* Toast notification */}
            {toast && (
                <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
                    {toast}
                </div>
            )}
        </div>
    );
}
