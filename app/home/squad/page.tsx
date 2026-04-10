"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faUsers, faEnvelope, faCrown } from '@fortawesome/free-solid-svg-icons';

export default function SquadPage() {
  const [squad, setSquad] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [availableSquads, setAvailableSquads] = useState<any[]>([]); // Added this
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSquadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Get the user's profile
      const { data: profile } = await supabase
        .from('users')
        .select('squad_id')
        .eq('id', user.id)
        .single();

      if (profile?.squad_id) {
        // 2. Fetch User's Squad Details & Members
        const [squadRes, membersRes] = await Promise.all([
          supabase.from('squads').select('*').eq('id', profile.squad_id).single(),
          supabase.from('users').select('username, role').eq('squad_id', profile.squad_id)
        ]);

        setSquad(squadRes.data);
        setMembers(membersRes.data || []);
      } else {
        // 3. If no squad, fetch other squads for the "Available Squads" list
        const { data: others } = await supabase
          .from('squads')
          .select('*')
          .limit(6);
        setAvailableSquads(others || []);
      }
      setLoading(false);
    };

    fetchSquadData();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-orange-500 font-black italic text-2xl">
      SYNCING SQUAD DATA...
    </div>
  );

  // --- EMPTY STATE RETURN ---
  if (!squad) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-6 pt-24 text-center">
        <div className="max-w-4xl mx-auto">
          <FontAwesomeIcon icon={faShieldAlt} size="4x" className="text-gray-800 mb-6" />
          <h2 className="text-2xl font-black text-white uppercase italic">No Squad Found</h2>
          <p className="text-gray-500 mt-2 mb-8">You haven't joined or created a squad yet.</p>
          
          <a href="/home/create-squad" className="inline-block bg-orange-600 text-white px-8 py-3 rounded-xl font-bold uppercase italic tracking-tighter shadow-lg shadow-orange-600/20 mb-12 hover:bg-orange-500 transition-all">
            Form a Squad
          </a>

          <h2 className="text-left text-xl font-bold mb-6 border-l-4 border-orange-500 pl-4 text-white uppercase italic">
            Available Squads
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableSquads.map((s) => (
              <div key={s.id} className="bg-[#111] border border-[#222] p-5 rounded-xl flex items-center gap-4 hover:border-orange-500/50 transition-colors group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-2xl text-black uppercase italic">
                  {s.name[0]}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg text-white group-hover:text-orange-500 transition-colors uppercase italic">{s.name}</h3>
                  <p className="text-gray-400 text-sm italic truncate max-w-[200px]">"{s.description || 'No motto set'}"</p>
                  <button className="mt-2 text-orange-500 text-xs font-bold uppercase tracking-tighter hover:underline">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- SQUAD DASHBOARD RETURN ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-400 p-6 pt-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: SQUAD INFO & MEMBERS */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-[#222] p-8 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 bg-orange-600 text-white text-[10px] font-black italic px-3 py-1 rounded-bl-xl uppercase">
               {squad.game?.toUpperCase()}
             </div>
             <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">{squad.name}</h1>
             <p className="text-sm mt-2 text-gray-500 italic">"{squad.description}"</p>
          </div>

          <div className="bg-[#111] border border-[#222] p-6 rounded-2xl">
            <h3 className="text-xs font-black text-gray-600 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-orange-600" /> 
              Roster ({members.length}/5)
            </h3>
            <div className="space-y-4">
              {members.map((member, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-white font-bold uppercase italic text-sm">{member.username}</span>
                  {member.role?.toLowerCase() === 'captain' ? (
                    <FontAwesomeIcon icon={faCrown} className="text-orange-500 text-xs" />
                  ) : (
                    <span className="text-[10px] text-gray-600 uppercase font-black italic">Member</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: SQUAD FEED */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] border border-[#222] p-6 rounded-2xl h-full">
            <h3 className="text-xs font-black text-gray-600 uppercase tracking-widest mb-6">Squad Feed</h3>
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#222] rounded-xl bg-black/20">
              <FontAwesomeIcon icon={faEnvelope} size="2x" className="text-gray-800 mb-2" />
              <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">No activity in the arena yet</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}