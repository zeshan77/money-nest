import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Shield, User as UserIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import GuestLayout from '@/layouts/GuestLayout';
import PinInput from '@/components/PinInput';

interface LoginUser {
    id: number;
    name: string;
    role: 'parent' | 'child';
}

interface Props {
    users: LoginUser[];
}

export default function Login({ users }: Props) {
    const [selectedUser, setSelectedUser] = useState<LoginUser | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        pin: '',
    });

    const openPinDialog = (user: LoginUser) => {
        setSelectedUser(user);
        setData({ user_id: user.id.toString(), pin: '' });
    };

    const closePinDialog = () => {
        setSelectedUser(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onError: () => setData('pin', ''),
        });
    };

    const handlePinChange = (pin: string) => {
        setData('pin', pin);
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            <div className="grid grid-cols-2 gap-4">
                {users.map((user) => (
                    <Card
                        key={user.id}
                        className="cursor-pointer transition-all hover:shadow-md hover:ring-2 hover:ring-green-500"
                        onClick={() => openPinDialog(user)}
                    >
                        <CardContent className="flex flex-col items-center gap-3 p-6">
                            <div
                                className={`flex h-16 w-16 items-center justify-center rounded-full ${
                                    user.role === 'parent'
                                        ? 'bg-green-100'
                                        : 'bg-blue-100'
                                }`}
                            >
                                {user.role === 'parent' ? (
                                    <Shield className="h-8 w-8 text-green-600" />
                                ) : (
                                    <UserIcon className="h-8 w-8 text-blue-600" />
                                )}
                            </div>
                            <div className="text-center">
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-xs capitalize text-gray-500">
                                    {user.role}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={selectedUser !== null} onOpenChange={(open) => !open && closePinDialog()}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Enter PIN for {selectedUser?.name}</DialogTitle>
                        <DialogDescription>
                            Enter your 4-digit PIN to continue.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <PinInput
                            value={data.pin}
                            onChange={handlePinChange}
                            disabled={processing}
                        />
                        {errors.pin && (
                            <p className="text-center text-sm text-red-600">
                                {errors.pin}
                            </p>
                        )}
                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={processing || data.pin.length !== 4}
                        >
                            {processing ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </GuestLayout>
    );
}
