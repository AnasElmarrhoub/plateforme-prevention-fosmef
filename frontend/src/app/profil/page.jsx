'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AdherentLayout from '@/components/AdherentLayout';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api';

export default function ProfilPage() {
  const { user: storedUser } = useAuth();
  const [profile, setProfile] = useState(storedUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    authApi.getMe()
      .then((data) => {
        if (data) setProfile(data);
      })
      .catch(() => {
        // Fallback to stored user in context if offline/error
      })
      .finally(() => setLoading(false));
  }, []);

  const user = profile || storedUser;

  return (
    <AdherentLayout>
      {/* ── EN-TÊTE PAGE ── */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-brand-blue tracking-tight">Mon Profil Adhérent</h1>
        <p className="text-xs text-slate-500 mt-1">Consultez vos informations personnelles et votre carte d'adhérent FOSMEF mises à jour en direct depuis la base de données.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── CARTE ADHÉRENT VIRTUELLE ── */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-brand-blue via-[#18345a] to-[#0d1e36] text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-white/10">
            {/* Formes décoratives FOSMEF */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-teal/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-ruby/20 rounded-full blur-2xl -ml-10 -mb-10"></div>

            {/* En-tête Carte */}
            <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-5 relative z-10">
              <div className="bg-white rounded-xl px-3.5 py-2 shadow-md border border-white/20 flex items-center justify-center">
                <Image src="/fos-logo.png" alt="Logo FOSMEF" width={110} height={45} className="object-contain h-10 w-auto" priority />
              </div>
              <span className="bg-brand-ruby text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                Adhérent Actif
              </span>
            </div>

            {/* Corps Carte */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-teal to-[#007b82] text-white flex items-center justify-center text-xl font-extrabold shadow-md border-2 border-white/20">
                  {user?.prenom?.[0]?.toUpperCase()}{user?.nom?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-slate-300 font-light uppercase tracking-wider">Identité Adhérent</p>
                  <h2 className="text-base font-extrabold text-white leading-tight">
                    {user?.prenom} {user?.nom}
                  </h2>
                  <p className="text-xs text-brand-teal font-semibold mt-0.5">{user?.role || 'ADHERENT'}</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 space-y-2 border border-white/10">
                <div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Numéro PPM</span>
                  <span className="text-sm font-extrabold text-brand-teal tracking-widest">{user?.ppm || 'Non renseigné'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Email</span>
                  <span className="text-xs text-slate-200 font-mono truncate block">{user?.email}</span>
                </div>
              </div>

              {/* QR Code Mockup */}
              <div className="pt-2 flex items-center justify-between border-t border-white/10 text-[10px] text-slate-300">
                <span>Fondation des Œuvres Sociales</span>
                <div className="flex items-center gap-1 font-mono text-[9px] text-brand-teal">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  VALIDÉ 2026
                </div>
              </div>
            </div>
          </div>

          {/* Badge de statut médical */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Statut Dossier Prévention</h3>
            <div className="flex items-center gap-3 p-3 bg-brand-teal/5 border border-brand-teal/20 rounded-xl text-brand-teal text-xs font-semibold">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Compte synchironisé avec PostgreSQL</span>
            </div>
          </div>
        </div>

        {/* ── FORMULAIRE D'INFORMATIONS ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-extrabold text-brand-blue flex items-center gap-2">
                <span className="w-1.5 h-5 bg-brand-teal rounded-full"></span>
                Informations Personnelles
              </h2>
              <span className="text-xs text-brand-teal font-semibold">
                {loading ? 'Mise à jour depuis la base...' : '✓ En direct depuis la DB'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Nom
                </label>
                <div className="w-full px-4 py-2.5 bg-brand-gray border border-slate-200 rounded-xl text-sm font-semibold text-slate-700">
                  {user?.nom || 'Non renseigné'}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Prénom
                </label>
                <div className="w-full px-4 py-2.5 bg-brand-gray border border-slate-200 rounded-xl text-sm font-semibold text-slate-700">
                  {user?.prenom || 'Non renseigné'}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Adresse Email
                </label>
                <div className="w-full px-4 py-2.5 bg-brand-gray border border-slate-200 rounded-xl text-sm font-semibold text-slate-700">
                  {user?.email || 'Non renseigné'}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  N° PPM (Identifiant Adhérent)
                </label>
                <div className="w-full px-4 py-2.5 bg-brand-gray border border-slate-200 rounded-xl text-sm font-bold text-brand-teal">
                  {user?.ppm || 'Non renseigné'}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Téléphone
                </label>
                <div className="w-full px-4 py-2.5 bg-brand-gray border border-slate-200 rounded-xl text-sm font-semibold text-slate-700">
                  {user?.telephone || 'Non renseigné'}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Rôle sur la plateforme
                </label>
                <div className="w-full px-4 py-2.5 bg-brand-ruby/5 border border-brand-ruby/20 rounded-xl text-sm font-bold text-brand-ruby">
                  {user?.role || 'ADHERENT'}
                </div>
              </div>

            </div>

            {/* Note de sécurité / RGPD */}
            <div className="p-4 bg-brand-gray/60 rounded-xl border border-slate-100 flex items-start gap-3">
              <svg className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Vos informations personnelles sont sécurisées conformément à la loi 09-08 (CNDP). Pour toute modification majeure de votre dossier adhérent, veuillez contacter le secrétariat FOSMEF.
              </p>
            </div>
          </div>
        </div>

      </div>
    </AdherentLayout>
  );
}
