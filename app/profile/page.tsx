"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faHeart, faComment, faEllipsisH } from "@fortawesome/free-solid-svg-icons";

export default function ProfilePage() {
  // Sample Data - Replace with your Supabase state later
  const user = {
    name: "Fname Mname Sname",
    email: "user.sample@email.com",
    bio: "BIO",
    role: "Player Role",
    squad: "Not a squad Member",
  };

  return (
    <div className="min-h-screen bg-[#1a1625] text-white p-4 md:p-8">

      <div className="h-20 md:h-20 w-full" />

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- HEADER SECTION --- */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md relative">
          <button className="absolute top-6 right-8 text-gray-400 hover:text-orange-500 transition-colors">
            <FontAwesomeIcon icon={faEdit} size="lg" />
          </button>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar Placeholder */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-300 rounded-full border-4 border-white/10 shrink-0" />
            
            <div className="text-center md:text-left space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold text-orange-500">{user.name}</h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <p className="text-gray-300 italic text-sm pt-2">{user.bio}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
            <span className="text-gray-400 text-sm uppercase tracking-widest">{user.squad}</span>
            <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">{user.role}</span>
          </div>
        </div>

        {/* --- COMPETITIVE STATS SECTION --- */}
        <div>
          <h2 className="text-xs font-bold tracking-widest text-gray-400 mb-3 uppercase">Competitive Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard label="Win Rate" value="0%" highlight />
            <StatCard label="Squad Rank" value="—" />
            <StatCard label="Squad Points" value="—" />
            <StatCard label="Total Tourney" value="—" />
            <StatCard label="Awards" value="—" />
          </div>
        </div>

        {/* --- BOTTOM GRID: HEROES & POSTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Top 3 Heroes Area */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Top 3 Heroes</h2>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>

          {/* Posts & Updates Area */}
          <div className="space-y-4">
            <div className="flex gap-6 border-b border-white/10 pb-2">
              <button className="text-sm font-bold border-b-2 border-orange-500 pb-2">POSTS</button>
              <button className="text-sm font-bold text-gray-500 pb-2 hover:text-gray-300">SQUAD UPDATES</button>
            </div>

            {/* Post Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              <div className="aspect-video bg-gray-200/10 m-4 rounded-xl relative">
                {/* Icons inside the post image area */}
                <div className="absolute bottom-4 left-4 flex gap-4 text-white">
                   <FontAwesomeIcon icon={faHeart} className="cursor-pointer hover:text-red-500" />
                   <FontAwesomeIcon icon={faComment} className="cursor-pointer hover:text-orange-500" />
                </div>
              </div>

              {/* Author Footer */}
              <div className="p-4 flex items-center justify-between border-t border-white/5 bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-400 rounded-full" />
                  <div>
                    <p className="text-sm font-bold">{user.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase">0 hours ago</p>
                  </div>
                </div>
                <FontAwesomeIcon icon={faEllipsisH} className="text-gray-500 cursor-pointer" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Small helper component for Stat Cards
function StatCard({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{label}</p>
      <p className={`text-2xl font-black ${highlight ? 'text-white' : 'text-gray-400'}`}>{value}</p>
    </div>
  );
}