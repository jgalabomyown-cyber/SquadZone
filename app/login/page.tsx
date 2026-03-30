'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

        setLoading(true);

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      setSuccess("Login successful!");

      // 🔥 Redirect after successful login
      router.push("/UserHomepage");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset password.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (resetError) throw resetError;
      setSuccess("Password reset email sent! Check your inbox.");
    } catch (err) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-body">
      <div className="signin-container">
        <h1>Sign In</h1>

        <form className="signin-form" onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />  

          {error && <p style={{ color: "#ff4e00", fontWeight: "500" }}>{error}</p>}
          {success && <p style={{ color: "#4caf50", fontWeight: "500" }}>{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p style={{ marginTop: "15px", fontSize: "14px" }}>
            <span
              style={{ color: "#ff4e00", cursor: "pointer" }}
              onClick={handleForgotPassword}
            >
              Forgot password?
            </span>
          </p>

          <p style={{ marginTop: "10px", fontSize: "14px" }}>
            Don’t have an account yet?{" "}
            <a href="/signup" style={{ color: "#ff4e00" }}>
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
