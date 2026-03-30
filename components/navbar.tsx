'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faBell, faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import '../app/css/navbar.css';
import UserActions from './userActions';
import { supabase } from '../lib/supabaseClient';

export default function Navbar() {
    const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const router = useRouter();
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

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        let loginEmail = email;

        if (authMode === 'login') {
            if (!loginEmail.includes('@')) {
                const { data: userRow, error: lookupError } = await supabase
                    .from('users')
                    .select('email')
                    .eq('username', loginEmail)
                    .single();

                if (lookupError || !userRow) {
                    setError('Username not found.');
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
                setLoading(false);
            } else {
                closeAuth();

                const { data: roleData } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', authData.user.id)
                    .single();

                router.push(roleData?.role === 'admin' ? '/admin-dashboard' : '/dashboard');
            }
        } else {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { display_name: username } },
            });

            if (signUpError) {
                setError(signUpError.message);
            } else {
                setSuccess('Success! Check your email to confirm.');
                closeAuth();
            }
        }
        setLoading(false);
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Please enter your email to reset password.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/auth/update-password',
            });
            if (resetError) throw resetError;
            setSuccess('Password reset email sent! Check your inbox.');
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="navbar-header">
                <h1 className="logo">SquadZone</h1>
                <nav className="menu-btns">
                    <a href="#" className="menu-link">HOME</a>
                    <a href="#" className="menu-link">SQUAD</a>
                    <a href="#" className="menu-link">LEADERBOARDS</a>
                    <a href="#" className="menu-link">TOURNAMENTS</a>
                    <a href="#" className="menu-link">STORE</a>
                </nav>
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

                        <form className="modal-form" onSubmit={handleAuth}>
                            {authMode === 'signup' && (
                                <div className="input-group">
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder={authMode === 'login' ? 'Email or Username' : 'Email'}
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

                            {authMode === 'login' && (
                                <p className='forgot-pass'>
                                    <a href='/update-password'
                                        onClick={handleForgotPassword}
                                    >
                                        Forgot password?
                                    </a>
                                </p>
                            )}

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'PROCESSING...' : (authMode === 'login' ? 'ENTER THE ARENA' : 'CREATE ACCOUNT')}
                            </button>

                            <p className="account-not-exists">
                                {authMode === 'login' ? (
                                    <>No Account Yet? <span className="switch-link" onClick={() => setAuthMode('signup')}>SIGNUP</span></>
                                ) : (
                                    <>Already have an account? <span className="switch-link" onClick={() => setAuthMode('login')}>LOGIN</span></>
                                )}
                            </p>

                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
