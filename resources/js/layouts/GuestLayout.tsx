import type { ReactNode } from 'react';

export default function GuestLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-green-600">Money Nest</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Family Expense Tracker
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
}
