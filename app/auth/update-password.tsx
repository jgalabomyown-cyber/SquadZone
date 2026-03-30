"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: "Password updated successfully! Redirecting..." });
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a' }}>
      <form onSubmit={handleUpdate} className="modal-form" style={{ background: '#111', padding: '40px', borderRadius: '8px', border: '1px solid #333', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ color: '#fff', marginBottom: '20px', textAlign: 'center' }}>Set New Password</h2>
        
        <div className="input-group" style={{ marginBottom: '20px' }}>
            <input 
              type="password" 
              placeholder="Enter new password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: 'none' }}
            />
        </div>

        {message.text && (
            <p style={{ color: message.type === 'error' ? '#ff4e00' : '#4caf50', textAlign: 'center', marginBottom: '15px' }}>
                {message.text}
            </p>
        )}

        <button type="submit" className="submit-btn" disabled={loading} style={{ width: '100%', padding: '12px', background: '#ff4e00', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'UPDATING...' : 'CONFIRM NEW PASSWORD'}
        </button>
      </form>
    </div>
  );
}