"use client";
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface LoginProps {
  onSuccess: () => void;
  switchToSignup: () => void;
}

export default function Login({ onSuccess, switchToSignup }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let loginEmail = email;

    // Username lookup logic
    if (!loginEmail.includes('@')) {
      const { data: userRow, error: lookupError } = await supabase
        .from('users')
        .select('email')
        .eq('username', loginEmail)
        .single();

      if (lookupError || !userRow) {
        alert("Username not found.");
        setLoading(false);
        return;
      }
      loginEmail = userRow.email;
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (authError) {
      alert(authError.message);
    } else {
      onSuccess(); // Closes the modal in Navbar
      const { data: roleData } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      router.push(roleData?.role === 'admin' ? '/admin' : '/home');
    }
    setLoading(false);
  };

  return (
    <form className="modal-form" onSubmit={handleLogin}>
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Email or Username" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      <div className="input-group">
        <input 
          type="password" 
          placeholder="Password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>
      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'PROCESSING...' : 'ENTER THE ARENA'}
      </button>
      <p className="account-not-exists">
        No Account Yet? <span className="switch-link" onClick={switchToSignup}>SIGNUP</span>
      </p>
    </form>
  );
}