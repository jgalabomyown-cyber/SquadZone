"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import AdminNavigation from '@/components/adminNavigations';
import { supabase } from '@/lib/supabaseClient';
import AdminHeader from '@/components/adminHeader';


export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSquads: 0,
    activeMatches: 0,
    visitorData: [] as { name: string; visitors: number }[],
    gameData: [] as { name: string; value: number }[],
    matchStatus: { upcoming: 0, live: 0, ended: 0 }
  });
  const [timeRange, setTimeRange] = useState('1 Day');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        { count: usersCount, error: usersError },
        { count: squadsCount, error: squadsError },
        { count: matchesCount, error: matchesError },
        { data: visitorsData, error: visitorsError }
      ] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('squads').select('id', { count: 'exact', head: true }),
        supabase.from('matches').select('id', { count: 'exact', head: true }).eq('status', 'live'),
        supabase.from('visitor_logs').select('visited_at').order('visited_at', { ascending: false }).limit(7)
      ]);

      if (usersError || squadsError || matchesError || visitorsError) {
        throw new Error('Database query failed');
      }

      // Visitor data for chart (group by day)
      const visitorCounts = visitorsData.reduce((acc: Record<string, number>, log: any) => {
        const date = new Date(log.visited_at).toLocaleDateString('en-US', { weekday: 'short' });
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const visitorChartData: { name: string; visitors: number }[] = Object.entries(visitorCounts).map(([name, visitors]) => ({ 
        name, 
        visitors 
      }));

      // Game data (mock for now; fetch from matches/games table in future)
      const gameChartData: { name: string; value: number }[] = [
        { name: 'MLBB', value: Math.floor(Math.random() * 100) },
        { name: 'HOK', value: Math.floor(Math.random() * 50) },
        { name: 'WR', value: Math.floor(Math.random() * 30) }
      ];

      setStats({
        totalUsers: usersCount || 0,
        totalSquads: squadsCount || 0,
        activeMatches: matchesCount || 0,
        visitorData: visitorChartData,
        gameData: gameChartData,
        matchStatus: { upcoming: 12, live: 4, ended: 156 } // Mock; fetch real in future
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0914] text-gray-300">
        <AdminNavigation />
        <main className="flex-1 p-8 lg:ml-64 pt-16 flex items-center justify-center">
          <div className="text-red-400 text-center">
            <h2 className="text-xl font-bold mb-2">Data Load Error</h2>
            <p>{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-4 bg-orange-600 hover:bg-orange-500 px-6 py-2 rounded-lg font-bold transition-colors"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0914] text-gray-300">
      <AdminNavigation />
      
      {/* --- MAIN CONTENT --- */}
      <AdminHeader title="Overview" />
      <main className="flex-1 p-8 overflow-y-auto lg:ml-64"> 
        {/* AdminHeader handles title + utilities, removed old header & pt-16 (handled by layout) */}
        <div className="mb-8 flex justify-between items-center">
          <div />
          <div className="flex gap-4">
             {/* Time Range Dropdown */}
             <select 
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
             >
               <option>1 Hour</option>
               <option>1 Day</option>
               <option>1 Month</option>
               <option>1 Year</option>
             </select>
             <input type="date" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-24 animate-pulse" />
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-24 animate-pulse" />
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-24 animate-pulse" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-80 animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
              <div className="h-64 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {/* --- TOP STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Total Users</h4>
                <p className="text-3xl font-black text-white">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-green-400 text-sm mt-1">+3% this month</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Total Squads</h4>
                <p className="text-3xl font-black text-white">{stats.totalSquads.toLocaleString()}</p>
                <p className="text-green-400 text-sm mt-1">+1% this week</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Active Matches</h4>
                <p className="text-3xl font-black text-white">{stats.activeMatches}</p>
                <p className="text-xs text-gray-400 mt-1">Live now</p>
              </div>
            </div>

            {/* --- VISITOR ACTIVITY CHART --- */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Visitor Activity</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.visitorData.length ? stats.visitorData : [{ name: 'No data', visitors: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="visitors" stroke="#ea580c" strokeWidth={3} dot={{ fill: '#ea580c', r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* --- BOTTOM GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Match Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-20 flex items-center">
                    <span className="text-gray-500 text-xs">Loading...</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-20 flex items-center">
                    <span className="text-gray-500 text-xs">Loading...</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-20 flex items-center">
                    <span className="text-gray-500 text-xs">Loading...</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Activity by Game</h3>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.gameData.length ? stats.gameData : [{ name: 'No data', value: 0 }]}>
                      <Bar dataKey="value" fill="#ea580c" radius={[4, 4, 0, 0]} />
                      <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}


