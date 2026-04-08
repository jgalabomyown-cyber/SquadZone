"use client";
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminNavigation from '@/components/adminNavigations';
import { faUsers, faLayerGroup, faGamepad, faChartLine, faCalendarAlt,
    faTrophy, faFileUpload
 } from '@fortawesome/free-solid-svg-icons';

// Sample Data for the Charts
const visitorData = [
  { name: 'Sun', visitors: 40 }, { name: 'Mon', visitors: 90 },
  { name: 'Tue', visitors: 65 }, { name: 'Wed', visitors: 160 },
  { name: 'Thu', visitors: 95 }, { name: 'Fri', visitors: 140 },
];

const gameData = [
  { name: 'MLBB', value: 85 }, { name: 'HOK', value: 25 }, { name: 'WR', value: 10 },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('1 Day');

  return (
    <div className="min-h-screen bg-[#0d0914] text-gray-300 flex">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-white/5 bg-black/20 p-6 hidden lg:block">
        <div className="text-orange-500 font-black text-2xl italic tracking-tighter mb-10">SQUADZONE</div>
        <nav className="space-y-2">
          <NavItem icon={faChartLine} label="Dashboard" active />
          <NavItem icon={faUsers} label="Users" />
          <NavItem icon={faLayerGroup} label="Squads" />
          <NavItem icon={faGamepad} label="Matches" />
          <NavItem icon={faTrophy} label="Tournaments" />
          <NavItem icon={faFileUpload} label="Media" />
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Overview</h1>
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
        </header>

        {/* --- TOP STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Users" value="125,480" trend="+3%" />
          <StatCard title="Total Squads" value="18,910" trend="+1%" />
          <StatCard title="Active Matches" value="42" subtext="MLBB (21), HOK (15), WR (6)" />
        </div>

        {/* --- VISITOR ACTIVITY CHART --- */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Visitor Activity</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1625', border: '1px solid #ffffff20', borderRadius: '12px' }}
                  itemStyle={{ color: '#ea580c' }}
                />
                <Line type="monotone" dataKey="visitors" stroke="#ea580c" strokeWidth={3} dot={{ fill: '#ea580c', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- BOTTOM GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Match Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Match Status</h3>
            <div className="grid grid-cols-3 gap-4">
              <StatusBox label="Upcoming" count="18" color="border-orange-500" />
              <StatusBox label="Streaming" count="4" color="border-orange-500" isLive />
              <StatusBox label="Ended" count="122" color="border-gray-700" />
            </div>
          </div>

          {/* Platform Sync (Bar Chart) */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Activity by Game</h3>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gameData}>
                  <Bar dataKey="value" fill="#ea580c" radius={[4, 4, 0, 0]} />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function NavItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'hover:bg-white/5'}`}>
      <FontAwesomeIcon icon={icon} className="w-5" />
      <span className="font-bold text-sm uppercase tracking-tight">{label}</span>
    </div>
  );
}

function StatCard({ title, value, trend, subtext }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4">
        {trend && <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">{trend}</span>}
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{title}</p>
      <p className="text-3xl font-black text-white">{value}</p>
      {subtext && <p className="text-[10px] text-gray-400 mt-2">{subtext}</p>}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-orange-600 group-hover:w-full transition-all duration-500" />
    </div>
  );
}

function StatusBox({ label, count, color, isLive }) {
  return (
    <div className={`bg-white/5 border-l-4 ${color} rounded-r-xl p-4`}>
      <p className="text-[10px] font-bold uppercase text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-xl font-black text-white">{count}</span>
        {isLive && <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full" />}
      </div>
    </div>
  );
}