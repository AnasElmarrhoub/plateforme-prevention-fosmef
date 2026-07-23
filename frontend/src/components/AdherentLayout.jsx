'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ChatbotWidget from '@/components/ChatbotWidget';

const navItems = [
  {
    href: '/dashboard',
    label: 'Tableau de bord',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: '/campagnes',
    label: 'Campagnes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    href: '/mes-reservations',
    label: 'Mes Réservations',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: '/profil',
    label: 'Mon Profil',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function AdherentLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-brand-gray font-sans overflow-hidden">

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-brand-blue transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex`}
      >
        {/* Logo */}
        <div className="flex flex-col items-center px-5 py-5 border-b border-white/10">
          <Link href="/dashboard" className="bg-white rounded-2xl p-3 px-6 shadow-lg border border-white/20 transition-all duration-200 hover:scale-105 flex items-center justify-center w-[185px]">
            <Image
              src="/fos-logo.png"
              alt="Logo FOSMEF"
              width={160}
              height={70}
              className="object-contain h-14 w-auto"
              priority
            />
          </Link>
          <span className="text-[10px] text-brand-teal font-extrabold uppercase tracking-widest mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse"></span>
            Espace Adhérent
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/20'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info + Logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <Link href="/profil" className="flex items-center gap-3 mb-3 px-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-brand-ruby flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.prenom?.[0]?.toUpperCase()}{user?.nom?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">{user?.prenom} {user?.nom}</p>
              <p className="text-slate-400 text-[10px] truncate">{user?.email}</p>
            </div>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-100 bg-brand-ruby/20 border border-brand-ruby/30 hover:bg-brand-ruby hover:text-white hover:border-brand-ruby hover:shadow-md hover:shadow-brand-ruby/30 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Backdrop (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 flex-shrink-0 shadow-xs">
          {/* Hamburger (mobile) */}
          <button
            className="md:hidden text-slate-500 hover:text-brand-blue transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page title derived from path */}
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-brand-teal rounded-full hidden md:block"></div>
            <span className="text-slate-700 font-semibold text-sm hidden md:block">
              {pathname === '/dashboard' && 'Tableau de bord'}
              {pathname === '/campagnes' && 'Campagnes de prévention'}
              {pathname.startsWith('/campagnes/') && 'Détail de la campagne'}
              {pathname === '/mes-reservations' && 'Mes Réservations'}
              {pathname === '/profil' && 'Mon Profil Adhérent'}
            </span>
          </div>

          {/* Right header info */}
          <Link href="/profil" className="flex items-center gap-3 group">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-700 group-hover:text-brand-teal transition-colors">{user?.prenom} {user?.nom}</p>
              {user?.ppm && <p className="text-[10px] text-slate-400">PPM: {user.ppm}</p>}
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-ruby flex items-center justify-center text-white text-sm font-bold shadow-xs">
              {user?.prenom?.[0]?.toUpperCase()}{user?.nom?.[0]?.toUpperCase()}
            </div>
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="h-10 bg-white border-t border-slate-100 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] text-slate-400">
            © {new Date().getFullYear()} FOSMEF — Plateforme de Prévention Médicale
          </span>
        </footer>
      </div>

      {/* Gemini AI Chatbot Floating Widget */}
      <ChatbotWidget />
    </div>
  );
}
