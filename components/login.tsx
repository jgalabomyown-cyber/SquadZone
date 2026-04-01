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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    let loginEmail = email;

    // Username lookup logic
    if (!loginEmail.includes('@')) {
      const { data: userRow, error: lookupError } = await supabase
        .from('users')
        .select('email')
        .eq('username', loginEmail)
        .single();

      if (lookupError || !userRow) {
        setError("Username not found.");
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
      setError(authError.message);
    } else {
      onSuccess(); 
      const { data: roleData } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      router.push(roleData?.role === 'admin' ? '/admin-dashboard' : '/home');
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess('Reset link sent! Check your email.');
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

      {error && <p style={{ color: "#ff4e00", fontSize: "14px", fontWeight: "500" }}>{error}</p>}
      {success && <p style={{ color: "#4caf50", fontSize: "14px", fontWeight: "500" }}>{success}</p>}

      <p className='forgot-pass'>
        <button 
          type="button" 
          className='link-button' 
          style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
          onClick={handleForgotPassword}
        >
          Forgot password?
        </button>
      </p>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'PROCESSING...' : 'ENTER THE ARENA'}
      </button>
      
      <p className="account-not-exists">
        No Account Yet? <span className="switch-link" onClick={switchToSignup}>SIGNUP</span>
      </p>
    </form>
  );
}