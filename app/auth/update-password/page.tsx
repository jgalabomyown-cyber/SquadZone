 "use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  useEffect(() => {
    // Clear the hash after reading to clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
    
    // Check if we have a recovery session (Supabase sets it automatically)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error || !session) {
        setMessage({ type: 'error', text: 'Invalid or expired reset link. Please request a new one.' });
      } else {
        // Recovery mode check - Supabase marks it in session
        setLoading(false);
      }
      setLoading(false);
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password updated! Redirecting...' });
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1500);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-white text-lg">Verifying reset link...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <form onSubmit={handleUpdate} className="bg-[#111] p-10 rounded-lg border border-[#333] w-full max-w-md">
        <h2 className="text-white text-2xl text-center mb-8">Set New Password</h2>
        
        <div className="mb-6">
          <input
            type="password"
            placeholder="Enter new password (min 6 chars)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-3 rounded border border-[#333] bg-[#222] text-white"
          />
        </div>

        {message.text && (
          <p className={`text-center mb-4 ${message.type === 'error' ? 'text-[#ff4e00]' : 'text-[#4caf50]'}`}>
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded font-bold text-white border-none ${
            loading 
              ? 'bg-[#666] cursor-not-allowed' 
              : 'bg-[#ff4e00] hover:bg-[#e64a00] cursor-pointer'
          }`}
        >
          {loading ? 'UPDATING...' : 'CONFIRM NEW PASSWORD'}
        </button>
      </form>
    </div>
  );
}

