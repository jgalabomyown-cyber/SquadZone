"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { supabase } from '@/lib/supabaseClient';
import { 
  faChartPie, faUsers, faShieldAlt, faGamepad, 
  faClock, faSignOutAlt, faBars, faTimes 
} from '@fortawesome/free-solid-svg-icons';

export default function AdminNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const menuItems = [
    { label: 'Home', icon: faChartPie, href: '/admin-dashboard' },
    { label: 'User Management', icon: faUsers, href: '/admin-dashboard/users' },
    { label: 'Squad Control', icon: faShieldAlt, href: '/admin-dashboard/squads' },
    { label: 'Match Engine', icon: faGamepad, href: '/admin-dashboard/matches' },
    { label: 'Visitor Logs', icon: faClock, href: '/admin-dashboard/logs' },
  ];

  return (
    <>
      {/* MOBILE HAMBURGER (Visible only on small screens) */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-orange-600 p-3 rounded-lg text-white shadow-lg"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        fixed top-0 left-0 h-full bg-[#111] border-r border-white/5 z-40
        w-64 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8">
          <div className="text-orange-600 font-black text-2xl italic tracking-tighter mb-10">
            SQ<span className="text-white text-sm">ADMIN</span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all group
                  ${pathname === item.href 
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                    : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'}
                `}
              >
                <FontAwesomeIcon icon={item.icon} className="w-5" />
                <span className="font-bold text-sm uppercase tracking-tight">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* LOGOUT AT BOTTOM */}
        <div className="absolute bottom-0 w-full p-8 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 text-gray-500 hover:text-red-500 transition-colors w-full font-bold text-sm uppercase"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}