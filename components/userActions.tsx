'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faBell, faUser, faTimes, faSignOutAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../lib/supabaseClient';

export default function UserActions({user}: {user: any}) {
    const [isOpen,setIsOpen] = useState(false);
    const router = useRouter();

    //Logout Logic
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error.message);
        } else {
            router.push('/');
            router.refresh();
        }
    }
    return (
        <div className="user-actions">
            <button className="icon-btn"><FontAwesomeIcon icon={faMessage} /></button>
            <button className="icon-btn"><FontAwesomeIcon icon={faBell} /></button>
            {/* The Profile Trigger */}
            <div className="profile-trigger" onClick={() => setIsOpen(!isOpen)}>
                <div className="avatar-circle">
                    <FontAwesomeIcon icon={faUser} />
                </div>
                <FontAwesomeIcon icon={faChevronDown} className={`arrow ${isOpen ? 'open' : ''}`} />
            </div>
            {/* The Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Invisible overlay to close dropdown when clicking outside */}
                    <div className="dropdown-overlay" onClick={() => setIsOpen(false)} />
                    
                    <ul className="user-dropdown">
                        <li className="dropdown-item user-info">
                            <span>{user?.email}</span>
                        </li>
                        <hr className="dropdown-divider" />
                        <li className="dropdown-item logout" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            <span>Logout</span>
                        </li>
                    </ul>
                </>
            )}
        </div>
    );
}