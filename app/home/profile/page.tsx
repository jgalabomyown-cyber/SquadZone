"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faHeart, faComment, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/lib/supabaseClient"; // Make sure this path is correct

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserData({
          name: user.user_metadata?.display_name || "New Player",
          email: user.email,
          bio: user.user_metadata?.bio || "No bio set yet.",
          role: user.user_metadata?.role || "Player",
          squad: user.user_metadata?.squad || "Not in Squad"
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  // FIXED: Changed { } to ( )
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1a1625] text-orange-500 font-black italic text-2xl">
        LOADING PROFILE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1625] text-white p-4 md:p-8">
      {/* Spacer for Navbar */}
      <div className="h-20 w-full" />
      
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- HEADER SECTION --- */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md relative">
          <button className="absolute top-6 right-8 text-gray-400 hover:text-orange-500 transition-colors">
            <FontAwesomeIcon icon={faEdit} size="lg" />
          </button>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-orange-500 rounded-full border-4 border-white/10 shrink-0 flex items-center justify-center text-4xl font-black text-[#1a1625]">
              {userData?.name?.[0]?.toUpperCase()}
            </div>

            <div className="text-center md:text-left space-y-1">
              {/* FIXED: Changed user.name to userData.name */}
              <h1 className="text-2xl md:text-3xl font-bold text-orange-500">{userData?.name}</h1>
              <p className="text-gray-400 text-sm">{userData?.email}</p>
              <p className="text-gray-300 italic text-sm pt-2">{userData?.bio}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
            {/* FIXED: Changed user.squad to userData.squad */}
            <span className="text-gray-400 text-sm uppercase tracking-widest">{userData?.squad}</span>
            <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">{userData?.role}</span>
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
          
          <div className="space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Top 3 Heroes</h2>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-6 border-b border-white/10 pb-2">
              <button className="text-sm font-bold border-b-2 border-orange-500 pb-2">POSTS</button>
              <button className="text-sm font-bold text-gray-500 pb-2 hover:text-gray-300">SQUAD UPDATES</button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              <div className="aspect-video bg-gray-200/10 m-4 rounded-xl relative">
                <div className="absolute bottom-4 left-4 flex gap-4 text-white">
                   <FontAwesomeIcon icon={faHeart} className="cursor-pointer hover:text-red-500" />
                   <FontAwesomeIcon icon={faComment} className="cursor-pointer hover:text-orange-500" />
                </div>
              </div>

              <div className="p-4 flex items-center justify-between border-t border-white/5 bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-400 rounded-full" />
                  <div>
                    {/* FIXED: Changed user.name to userData.name */}
                    <p className="text-sm font-bold">{userData?.name}</p>
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

function StatCard({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{label}</p>
      <p className={`text-2xl font-black ${highlight ? 'text-white' : 'text-gray-400'}`}>{value}</p>
    </div>
  );
}