"use client";
import React, { useState, useEffect } from 'react';
import AdminNavigation from '@/components/adminNavigations';
import { supabase } from '@/lib/supabaseClient';
import AdminHeader from '@/components/adminHeader';

interface User {
  id: string;
  email: string;
  username?: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('id, email, username, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0d0914] text-gray-300 lg:ml-64 p-8 flex items-center justify-center"><div className="animate-pulse">Loading users...</div></div>;
  if (error) return <div className="min-h-screen bg-[#0d0914] text-gray-300 lg:ml-64 p-8 flex items-center justify-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0d0914] text-gray-300">
      <AdminNavigation />
      <AdminHeader title="User Management" />
      <main className="p-8 lg:ml-64 overflow-auto pt-16">
        <p className="text-gray-500 mt-2 mb-8">Total users: {users.length}</p>
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-black/20">
              <tr>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-300">Email</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-300">Username</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-300">Role</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-300">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.username || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      user.role === 'admin' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
