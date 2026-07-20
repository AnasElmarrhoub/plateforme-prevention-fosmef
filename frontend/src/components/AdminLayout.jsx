'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const adminNavItems = [
  {
    href: '/admin/dashboard',
    label: 'Tableau de bord',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: '/admin/campagnes',
    label: 'Gestion Campagnes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-brand-gray font-sans overflow-hidden">

      {/* ── SIDEBAR ADMIN ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-brand-blue transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex`}
      >
        {/* Logo FOSMEF */}
        <div className="flex flex-col items-center px-5 py-5 border-b border-white/10">
          <Link href="/admin/dashboard" className="bg-white rounded-2xl p-3 px-6 shadow-lg border border-white/20 transition-all duration-200 hover:scale-105 flex items-center justify-center w-[185px]">
            <Image
              src="/fos-logo.png"
              alt="Logo FOSMEF"
              width={160}
              height={70}
              className="object-contain h-14 w-auto"
              priority
            />
          </Link>
          <span className="text-[10px] text-brand-ruby font-extrabold uppercase tracking-widest mt-3 flex items-center gap-1.5 bg-brand-ruby/15 px-3 py-0.5 rounded-full border border-brand-ruby/30">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-ruby animate-ping"></span>
            Espace Administration
          </span>
        </div>

        {/* Navigation Admin */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-brand-ruby text-white shadow-lg shadow-brand-ruby/25 font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info Admin + Logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-ruby flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
              {user?.prenom?.[0]?.toUpperCase()}{user?.nom?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">{user?.prenom} {user?.nom}</p>
              <span className="text-brand-teal text-[10px] font-bold block uppercase tracking-wider">Gestionnaire</span>
            </div>
          </div>
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

        {/* Header Admin */}
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
            <div className="w-1.5 h-6 bg-brand-ruby rounded-full hidden md:block"></div>
            <span className="text-slate-800 font-bold text-sm hidden md:block">
              {pathname === '/admin/dashboard' && 'Tableau de bord Administration'}
              {pathname === '/admin/campagnes' && 'Gestion des Campagnes de Prévention'}
              {pathname.includes('/inscrits') && 'Liste des Adhérents Inscrits'}
            </span>
          </div>

          {/* Right header info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-700">{user?.prenom} {user?.nom}</p>
              <p className="text-[10px] text-brand-ruby font-bold uppercase tracking-wider">Espace Gestionnaire</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-ruby flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {user?.prenom?.[0]?.toUpperCase()}{user?.nom?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="h-10 bg-white border-t border-slate-100 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] text-slate-400">
            © {new Date().getFullYear()} FOSMEF — Espace Administration & Gestion Médicale
          </span>
        </footer>
      </div>
    </div>
  );
}
