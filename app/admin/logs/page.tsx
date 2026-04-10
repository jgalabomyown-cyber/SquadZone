"use client";
import React, { useState, useEffect } from 'react';
import AdminNavigation from '@/components/adminNavigations';
import { supabase } from '@/lib/supabaseClient';
import AdminHeader from '@/components/adminHeader';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('visitor_logs')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(100);

      console.log('Fetched data:', data);
      console.log('Error:', error);

      if (error) throw error;
      setLogs(data || []);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0d0914] text-gray-300 lg:ml-64 p-8 flex items-center justify-center"><div className="animate-pulse">Loading logs...</div></div>;
  if (error) return <div className="min-h-screen bg-[#0d0914] text-gray-300 lg:ml-64 p-8 flex items-center justify-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0d0914] text-gray-300">
      <AdminNavigation />
      <AdminHeader title="Visitor Logs" />
      <main className="p-8 lg:ml-64 overflow-auto pt-16">
        <p className="text-gray-500 mt-2 mb-8">Recent {logs.length} visitors</p>
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-black/20">
              <tr>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-300">IP Address</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-300">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="p-4 font-mono text-sm">{log.ip_address}</td>
                  <td className="p-4 text-xs text-gray-500">{new Date(log.visited_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
