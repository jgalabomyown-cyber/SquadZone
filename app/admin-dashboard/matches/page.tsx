"use client";
import React, { useState, useEffect } from 'react';
import AdminNavigation from '@/components/adminNavigations';
import { supabase } from '@/lib/supabaseClient';

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0d0914] text-gray-300 pt-24 lg:ml-64 p-8 flex items-center justify-center"><div className="animate-pulse">Loading matches...</div></div>;
  if (error) return <div className="min-h-screen bg-[#0d0914] text-gray-300 pt-24 lg:ml-64 p-8 flex items-center justify-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0d0914] text-gray-300 pt-24">
      <AdminNavigation />
      <main className="p-8 lg:ml-64 overflow-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Match Engine</h1>
          <p className="text-gray-500 mt-2">Total matches: {matches.length}</p>
        </header>
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-black/20">
              <tr>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-300">Game</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-300">Status</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-300">Teams</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-300">Created</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="p-4">{match.game || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      match.status === 'live' ? 'bg-green-500/20 text-green-400' : 
                      match.status === 'upcoming' ? 'bg-orange-500/20 text-orange-400' : 
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {match.status}
                    </span>
                  </td>
                  <td className="p-4">{match.team1} vs {match.team2 || '-'}</td>
                  <td className="p-4 text-xs text-gray-500">{new Date(match.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
