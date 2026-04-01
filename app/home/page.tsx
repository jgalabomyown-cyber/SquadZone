"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const HomeCard: React.FC<{
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => (
  <div className={`bg-[#111] p-6 rounded-lg border border-[#333] shadow-xl ${className}`}>
    {title && (
      <h3 className="text-sm font-bold text-gray-500 mb-4 tracking-[0.2em] uppercase border-b border-[#222] pb-2">
        {title}
      </h3>
    )}
    {children}
  </div>
);

export default function DashboardLayout() {
  const [userName, setUserName] = useState("PLAYER-1");
  const [loading, setLoading] = useState(true);

  const leaderboards = [
    { rank: 1, name: "Neon Knights", points: 8200 },
    { rank: 2, name: "Shadow Strikers", points: 4500 },
    { rank: 3, name: "Apex Predators", points: 1200 },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.display_name) {
        setUserName(user.user_metadata.display_name);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-orange-500 font-black italic tracking-tighter text-3xl">
      LOADING ARENA...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-400 p-6 pt-25">
      
      {/* 1. SINGLE GRID CONTAINER: Handles responsive columns */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr_2fr] gap-8 max-w-[1600px] mx-auto">
        
        {/* === LEFT COLUMN: SQUAD & TOURNAMENTS (Hidden on Mobile/Tablet) === */}
        <div className="hidden xl:flex flex-col space-y-6">
          <HomeCard title="Your Squad">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-[#1a1a1a] border-2 border-dashed border-[#444] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">?</span>
              </div>
              <p className="text-white font-bold uppercase tracking-tight text-lg leading-tight">NO SQUAD JOINED</p>
              <p className="text-xs text-orange-500 mt-1 font-bold italic tracking-widest uppercase">"LONE WOLF STATUS"</p>
              <div className="flex gap-2 mt-6">
                <button className="flex-1 bg-white text-black text-[10px] font-black py-3 rounded hover:bg-gray-200 transition-colors uppercase">Join</button>
                <button className="flex-1 border border-[#333] text-white text-[10px] font-black py-3 rounded hover:bg-[#222] transition-colors uppercase">Create</button>
              </div>
            </div>
          </HomeCard>

          <HomeCard title="Active Tournaments">
            <div className="space-y-3">
              <div className="group bg-[#1a1a1a] p-4 rounded border-l-4 border-orange-600 hover:bg-[#222] cursor-pointer transition-all">
                <p className="text-white font-bold text-sm">ALPHA CUP 5V5</p>
                <p className="text-[10px] text-orange-500 font-bold uppercase">LIVE NOW</p>
              </div>
              <div className="group bg-[#1a1a1a] p-4 rounded border-l-4 border-gray-700 hover:bg-[#222] cursor-pointer transition-all">
                <p className="text-white font-bold text-sm">RECRUIT SCRIMS</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">MAY 15, 2026</p>
              </div>
            </div>
          </HomeCard>
        </div>

        {/* === CENTRAL COLUMN: WELCOME & COMMUNITY (Always Visible) === */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#111] to-[#0a0a0a] p-8 rounded-lg border border-[#333]">
            <h1 className="text-4xl font-black text-white italic tracking-tighter leading-none">
              WELCOME, <span className="text-orange-600">{userName.toUpperCase()}</span>
            </h1>
            <div className="h-1 w-20 bg-orange-600 mt-4"></div>
          </div>
          
          <HomeCard title="Community Posts">
            <div className="aspect-video bg-[#1a1a1a] rounded-lg mb-4 flex flex-col items-center justify-center border border-[#222] group cursor-pointer overflow-hidden">
                <div className="text-gray-600 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H208V157.51l-42.34-42.34a8,8,0,0,0-11.32,0L48,221.51ZM208,208H70.63l114-114L208,117.37V208ZM160,88a16,16,0,1,1-16-16A16,16,0,0,1,160,88Z"></path>
                  </svg>
                </div>
                <span className="text-[10px] mt-2 font-bold tracking-widest text-gray-700">NO MEDIA ATTACHED</span>
            </div>
            <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-600 rounded-full"></div>
                  <span className="text-white font-bold uppercase tracking-tighter">JESSEKID</span>
                </div>
                <div className="flex gap-4 font-bold text-[10px]">
                    <span className="hover:text-white cursor-pointer transition-colors">0 LIKES</span>
                    <span className="hover:text-white cursor-pointer transition-colors">COMMENTS</span>
                </div>
            </div>
          </HomeCard>
        </div>

        {/* === RIGHT COLUMN: POINTS & LEADERBOARDS (Hidden on Mobile/Tablet) === */}
        <div className="hidden xl:flex flex-col space-y-6">
          <HomeCard>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Season Points</p>
                <p className="text-3xl font-black text-white italic">1,250</p>
              </div>
              <div className="bg-orange-600/10 p-3 rounded-lg">
                 <svg className="text-orange-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                   <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A96,96,0,1,0,128,224a95.3,95.3,0,0,0,44.8-11.1,8,8,0,1,1,7.5,14.1A111.3,111.3,0,0,1,128,240a112,112,0,1,1,112-112A111.1,111.1,0,0,1,232,184a8,8,0,0,1-13.6-8.4,95.2,95.2,0,0,0,11.2-47.2,8,8,0,0,1,15.2-3.6ZM128,80a48,48,0,1,0,48,48A48.1,48.1,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32.1,32.1,0,0,1,128,160Z"></path>
                 </svg>
              </div>
            </div>
            <button className="w-full mt-4 text-[10px] font-black uppercase py-2 tracking-widest border border-[#333] hover:bg-[#222] transition-all rounded">
              Reward Shop
            </button>
          </HomeCard>
          
          <HomeCard title="Global Ranking">
            <div className="space-y-2">
              {leaderboards.map((squad) => (
                <div key={squad.rank} className="flex justify-between items-center bg-[#0d0d0d] p-3 rounded border border-transparent hover:border-[#333] transition-all">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-black w-5 ${squad.rank === 1 ? 'text-orange-500' : 'text-gray-600'}`}>0{squad.rank}</span>
                    <span className="text-xs text-white font-bold uppercase tracking-tighter">{squad.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-500">{squad.points} PTS</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-[9px] font-bold text-gray-600 hover:text-white uppercase tracking-[0.2em] transition-all">
               View Full Leaderboard
            </button>
          </HomeCard>
        </div>

      </div> {/* Grid closing tag */}
    </div>
  );
}