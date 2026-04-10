"use client";
import React, { useState, useEffect } from 'react';
import AdminNavigation from '@/components/adminNavigations';
import { supabase } from '@/lib/supabaseClient';
import AdminHeader from '@/components/adminHeader';

export default function SquadsPage() {
  const [squads, setSquads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSquads();
  }, []);

  const fetchSquads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('squads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSquads(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0d0914] text-gray-300 lg:ml-64 p-8 flex items-center justify-center"><div className="animate-pulse">Loading squads...</div></div>;
  if (error) return <div className="min-h-screen bg-[#0d0914] text-gray-300 lg:ml-64 p-8 flex items-center justify-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0d0914] text-gray-300">
      <AdminNavigation />
      <AdminHeader title="Squad Control" />
      <main className="p-8 lg:ml-64 overflow-auto pt-16">
        <p className="text-gray-500 mt-2 mb-8">Total squads: {squads.length}</p>
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-black/20">
              <tr>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-300">Name</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-300">Game</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-300">Members</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-300">Status</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-300">Created</th>
              </tr>
            </thead>
            <tbody>
              {squads.map((squad) => (
                <tr key={squad.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="p-4">{squad.name || '-'}</td>
                  <td className="p-4">{squad.game || '-'}</td>
                  <td className="p-4">{squad.member_count || 0}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-500">{new Date(squad.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
