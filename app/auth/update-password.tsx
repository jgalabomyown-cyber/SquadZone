"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully!");
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleUpdate} className="modal-form">
        <h2>Set New Password</h2>
        <input 
          type="password" 
          placeholder="Enter new password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'UPDATING...' : 'CONFIRM NEW PASSWORD'}
        </button>
      </form>
    </div>
  );
}