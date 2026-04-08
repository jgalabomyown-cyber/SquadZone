"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface AdminHeaderProps {
  title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-white/5 bg-[#0d0914]/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Left: Dynamic Page Title */}
      <h2 className="text-white font-black uppercase tracking-tighter text-lg">
        {title}
      </h2>

      {/* Right: Utility Icons */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <button className="text-gray-500 hover:text-white transition-colors">
          <FontAwesomeIcon icon={faSearch} />
        </button>

        {/* Notifications with Orange Dot */}
        <button className="text-gray-500 hover:text-white transition-colors relative">
          <FontAwesomeIcon icon={faBell} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-600 rounded-full border border-[#0d0914]" />
        </button>

        {/* User Profile Dropdown */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden border border-white/10">
            {/* Replace with actual admin image if available */}
            <div className="w-full h-full bg-gradient-to-tr from-orange-600 to-orange-400" />
          </div>
          <FontAwesomeIcon 
            icon={faChevronDown} 
            className="text-[10px] text-gray-500 group-hover:text-white transition-colors" 
          />
        </div>
      </div>
    </header>
  );
}