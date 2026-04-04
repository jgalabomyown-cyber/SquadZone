"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function SquadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [squad, setSquad] = useState<any>(null);
  const [availableSquads, setAvailableSquads] = useState<any[]>([]);

  useEffect(() => {
    const loadSquadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace("/");
        return;
      }
      setUser(session.user);

      // 1. Check if user is in a squad
      const { data: memberData } = await supabase
        .from("squad_members")
        .select("squad_id, squads(*)")
        .eq("user_id", session.user.id)
        .single();

      if (memberData) {
        setSquad(memberData.squads);
      } else {
        // 2. If not in a squad, fetch available squads to browse
        const { data: allSquads } = await supabase
          .from("squads")
          .select("*")
          .limit(10);
        setAvailableSquads(allSquads || []);
      }
      
      setLoading(false);
    };

    loadSquadData();
  }, [router]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#0d0914] text-orange-500 font-black italic text-2xl">
      SYNCING SQUAD DATA...
    </div>
  );

  // --- VIEW 1: THE LONE WOLF (No Squad) ---
  if (!squad) {
    return (
      <div className="min-h-screen bg-[#0d0914] pt-24 px-6 text-white pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-black italic tracking-tighter text-orange-500 mb-2">
            YOU'RE A LONE WOLF
          </h1>
          <p className="text-gray-400 mb-8 uppercase tracking-widest text-sm">
            Browse available squads or create your own legacy.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <button className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-full font-bold text-black transition-all">
              CREATE SQUAD
            </button>
          </div>

          <h2 className="text-left text-xl font-bold mb-6 border-l-4 border-orange-500 pl-4">
            AVAILABLE SQUADS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableSquads.map((s) => (
              <div key={s.id} className="bg-white/5 border border-white/10 p-5 rounded-xl flex items-center gap-4 hover:border-orange-500/50 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-2xl text-black">
                  {s.name[0]}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg">{s.name}</h3>
                  <p className="text-gray-400 text-sm italic">"{s.motto}"</p>
                  <button className="mt-2 text-orange-500 text-xs font-bold uppercase tracking-tighter">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: SQUAD DASHBOARD (Member) ---
  return (
    <div className="min-h-screen bg-[#0d0914] pt-24 px-4 sm:px-10 text-white pb-20">
      <div className="max-w-6xl mx-auto">
        
        {/* SQUAD HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12 bg-white/5 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
          <div className="w-32 h-32 bg-orange-500 rounded-2xl flex-shrink-0 flex items-center justify-center text-5xl font-black text-black italic shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            {squad.logo_url ? <img src={squad.logo_url} alt="logo" /> : squad.name[0]}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-black italic tracking-tighter uppercase">{squad.name}</h1>
            <p className="text-orange-500 font-bold italic tracking-widest mt-1">"{squad.motto}"</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FEED SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold tracking-tighter flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span> SQUAD FEED
            </h2>
            
            {/* SAMPLE POST */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-sm">Squad Leader</h4>
                  <p className="text-[10px] text-gray-500">2 HOURS AGO</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                New tournament starting tonight at 8PM! Everyone be online for practice. 🔥
              </p>
            </div>
          </div>

          {/* MEMBERS SIDEBAR */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tighter flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span> ROSTER
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 divide-y divide-white/5">
              {/* This is where you would map through actual members */}
              <div className="py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded border border-orange-500/40 flex items-center justify-center text-[10px] font-bold">LVL 40</div>
                <span className="font-bold text-sm">{user?.user_metadata?.display_name} (YOU)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}