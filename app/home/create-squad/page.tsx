"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faUsers, faInfoCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function CreateSquadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    game: 'Mobile Legends',
    motto: '',
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required.");

      // 1. Insert Squad into DB
      const { data: squad, error: squadError } = await supabase
        .from('squads')
        .insert([{ 
          name: formData.name, 
          game: formData.game, 
          motto: formData.motto, 
          captain_id: user.id 
        }])
        .select()
        .single();

      if (squadError) throw squadError;

      // 2. Update user role to 'Captain' in your users table
      await supabase
        .from('users')
        .update({ role: 'captain', squad_id: squad.id })
        .eq('id', user.id);

      router.push('/home'); // Redirect to dashboard
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-400 p-6 pt-24">
      <div className="max-w-2xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold hover:text-white transition-colors mb-8 group"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" />
          RETURN TO ARENA
        </button>

        <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden shadow-2xl">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-8 text-white">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                <FontAwesomeIcon icon={faShieldAlt} size="xl" />
              </div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase">Found a Squad</h1>
            </div>
            <p className="text-orange-100 text-sm font-medium">Establish your legacy. Recruit the best. Dominate the ranks.</p>
          </div>

          <form onSubmit={handleCreate} className="p-8 space-y-8">
            
            {/* Squad Name */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                <FontAwesomeIcon icon={faUsers} className="text-orange-600" />
                Squad Name
              </label>
              <input 
                required
                type="text"
                placeholder="e.g. SHADOW SLAYERS"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-600 transition-all font-bold"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Game Selector */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Target Game</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['Mobile Legends', 'Honor of Kings', 'Wild Rift'].map((game) => (
                  <button
                    key={game}
                    type="button"
                    onClick={() => setFormData({...formData, game})}
                    className={`py-4 rounded-xl border font-black text-[10px] uppercase transition-all ${
                      formData.game === game 
                      ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20' 
                      : 'bg-[#0a0a0a] border-[#333] hover:border-[#555]'
                    }`}
                  >
                    {game}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                <FontAwesomeIcon icon={faInfoCircle} className="text-orange-600" />
                Squad Motto / Description
              </label>
              <textarea 
                rows={4}
                placeholder="Define your squad's goal..."
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-600 transition-all font-medium"
                onChange={(e) => setFormData({...formData, motto: e.target.value})}
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-black py-5 rounded-xl uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all transform active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'INITIALIZING SQUAD...' : 'FINALIZE FORMATION'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}