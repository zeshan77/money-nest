import { Head, Link } from '@inertiajs/react';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <Wallet className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">
                        Money Nest
                    </h1>
                    <p className="mt-3 text-lg text-gray-500">
                        Track your family's daily expenses with ease.
                    </p>
                    <div className="mt-8">
                        <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                            <Link href="/login">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
