"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                router.push('/');
                return;
            }

            // Check the role in the database
            const { data } = await supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .single();

            if (data?.role !== 'admin') {
                router.push('/dashboard'); // Boot them to the regular dashboard
            } else {
                setIsAdmin(true);
            }
        };
        checkAdmin();
    }, [router]);

    if (!isAdmin) return <p className="p-10 text-white">Verifying Admin Credentials...</p>;

    return (
        <main className="p-10 bg-zinc-950 min-h-screen text-white">
            <h1 className="text-3xl font-bold text-red-500">Admin Command Center</h1>
            <p className="mt-4">Manage Players, Squads, and Tournaments here.</p>
        </main>
    );
}