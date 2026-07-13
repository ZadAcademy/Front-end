'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/shared/ui/button';

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-7xl text-black flex items-center justify-center p-4">Home</h1>
            <Button 
                onClick={() => signOut({ callbackUrl: '/login' })} 
                variant="destructive"
                className="w-32"
            >
                Logout / تسجيل الخروج
            </Button>
        </div>
    );
}