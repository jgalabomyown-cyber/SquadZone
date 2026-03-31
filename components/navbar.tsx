'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import '../app/css/navbar.css';
import UserActions from './userActions';
import { supabase } from '../lib/supabaseClient';
import Login from './login';

export default function Navbar() {
    const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        setAuthMode(null);
    }, [pathname]);

    const closeAuth = () => {
        setAuthMode(null);
        setEmail('');
        setPassword('');
        setUsername('');
        setError('');
        setSuccess('');
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name: username } },
        });

        if (signUpError) {
            setError(signUpError.message);
        } else {
            setSuccess('Success! Check your email to confirm.');
            // We don't closeAuth() immediately so they can see the success message
        }
        setLoading(false);
    };

    return (
        <>
            <header className="navbar-header">
                <h1 className="logo">SquadZone</h1>
                <nav className="menu-btns">
                    <a href="./dashboard" className="menu-link">SQUAD</a>
                    <a href="#" className="menu-link">LEADERBOARDS</a>
                    <a href="#" className="menu-link">TOURNAMENTS</a>
                    <a href="#" className="menu-link">STORE</a>
                </nav>

                <div className="search-bar">
                    <input type="text" placeholder='Search here'/>
                </div>
                <div className="login-join-opts">
                    {!user ? (
                        <>
                            <button onClick={() => setAuthMode('login')} className="login-btn">LOGIN</button>
                            <button onClick={() => setAuthMode('signup')} className="join-btn">JOIN</button>
                        </>
                    ) : (
                        <UserActions user={user} />
                    )}
                </div>
            </header>

            {authMode !== null && (
                <div className="modal-overlay" onClick={closeAuth}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeAuth} className="close-modal">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <h2 className="modal-title">
                            {authMode === 'login' ? 'Login to SquadZone' : 'Join the Squad'}
                        </h2>

                        {authMode === 'login' ? (
                            <Login onSuccess={closeAuth} switchToSignup={() => setAuthMode('signup')} />
                        ) : (
                            <form className="modal-form" onSubmit={handleSignup}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        placeholder="Email"
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
                                {error && <p style={{ color: "#ff4e00", fontWeight: "500" }}>{error}</p>}
                                {success && <p style={{ color: "#4caf50", fontWeight: "500" }}>{success}</p>}
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'PROCESSING...' : 'CREATE ACCOUNT'}
                                </button>
                                <p className="account-not-exists">
                                    Already have an account? <span className="switch-link" onClick={() => setAuthMode('login')}>LOGIN</span>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}