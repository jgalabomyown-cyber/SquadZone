'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import '../app/css/navbar.css';
import '../app/css/userAction.css';
import UserActions from './userActions';
import { supabase } from '../lib/supabaseClient';
import Login from './login';

import Link from 'next/link';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    useEffect(() => {
        setIsMenuOpen(false);
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
            <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center px-4 bg-[#0d0914] border-b border-white/10">

        <div className="flex content-start items-center gap-2 sm:gap-2">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden text-white text-lg sm:text-2xl p-1 hover:text-orange-500 transition-colors"
                >
                    <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
                </button>
                {/* LOGO SECTION */}
                <Link href="/home" className="shrink-0">
                    {/* This shows ONLY on Mobile/Tablet (below 1024px) */}
                    <span className="lg:hidden text-lg font-black text-orange-500 italic tracking-tighter bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                        SZ
                    </span>

                    {/* This shows ONLY on Desktop (1024px and up) */}
                    <span className="hidden lg:block text-2xl font-black text-orange-500 italic tracking-tighter">
                        SQUADZONE
                    </span>
                </Link>
                </div>
                <nav className="menu-btns hidden lg:flex">
                    <a href="./home" className="menu-link">HOME</a>
                    <a href="./squad" className="menu-link">SQUAD</a>
                    <a href="#" className="menu-link">LEADERBOARDS</a>
                    <a href="#" className="menu-link">TOURNAMENTS</a>
                    <a href="#" className="menu-link">STORE</a>
                </nav>

                <div className="search-bar hidden xl:block flex-1 max-w-xs mx-4">
                    <input 
                    className="outline-none focus:ring-0 focus:border-amber-600"
                    type="text" placeholder='Search here...'/>
                </div>
                <div className="login-join-opts flex items-center gap-2 sm:gap-4">
                    {!user ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button 
                            onClick={() => setAuthMode('login')} 
                            className="login-btn sm:text-xs text-[12px] tracking-widest hover: text-orange-500 transition-colors">LOGIN
                            </button>

                            <button 
                            onClick={() => setAuthMode('signup')} 
                            className="join-btn sm:px-5 sm:py-2 text-[11px] sm:text-xs hover:bg-white hover:text-black transition-all tracking-widest whitespace-nowrap">JOIN
                            </button>
                        </div>
                    ) : (
                        <UserActions user={user} />
                    )}
                </div>
            </header>

            {/* 6. SLIDE-OUT MOBILE SIDEBAR */}
            {/* Dark Overlay Background */}
            <div 
                className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 lg:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* The Actual Sidebar Menu */}
            <div className={`fixed top-0 left-0 h-full w-[280px] bg-[#0d0914] border-r border-white/10 z-[70] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 flex flex-col gap-6 pt-24">
                    <a href="./home" className="text-white font-bold text-lg hover:text-orange-500">HOME</a>
                    <a href="./squad" className="text-white font-bold text-lg hover:text-orange-500">SQUAD</a>
                    <a href="#" className="text-white font-bold text-lg hover:text-orange-500">LEADERBOARDS</a>
                    <a href="#" className="text-white font-bold text-lg hover:text-orange-500">TOURNAMENTS</a>
                    <a href="#" className="text-white font-bold text-lg hover:text-orange-500">STORE</a>
                </div>
            </div>

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