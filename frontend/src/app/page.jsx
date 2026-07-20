'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('ADHERENT'); // 'ADHERENT' | 'GESTIONNAIRE'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // redirection is handled automatically inside useAuth according to user.role
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col md:flex-row bg-brand-gray font-sans text-slate-800 overflow-hidden">
      
      {/* --- PARTIE GAUCHE (Formulaire de connexion) --- */}
      <div className="flex flex-col justify-between w-full h-full md:w-[45%] lg:w-[40%] p-6 lg:p-10 xl:p-12 bg-white shadow-2xl z-10 overflow-hidden">
        
        {/* Logo Ministère en haut */}
        <div className="flex justify-center mb-3">
          <Image
            src="/ministere-logo.png"
            alt="Ministère de l'Éducation Nationale"
            width={200}
            height={65}
            priority
            className="object-contain"
          />
        </div>

        {/* Formulaire et Logo FOSMEF au centre */}
        <div className="my-auto w-full max-w-sm mx-auto flex flex-col items-center md:items-stretch">
          
          {/* Logo FOSMEF */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-[150px] h-[68px] mb-2">
              <Image src="/fos-logo.png" alt="Logo FOSMEF" fill priority className="object-contain" />
            </div>

            {/* ── COMMUTATEUR D'ONGLET VISUEL (ADHÉRENT / ADMIN) ── */}
            <div className="w-full bg-slate-100 p-1 rounded-2xl flex items-center justify-between border border-slate-200/80 mb-3 shadow-inner">
              <button
                type="button"
                onClick={() => { setActiveTab('ADHERENT'); setError(''); }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'ADHERENT'
                    ? 'bg-white text-brand-teal shadow-md shadow-brand-teal/10 border border-slate-100'
                    : 'text-slate-500 hover:text-brand-blue'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Espace Adhérent
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('GESTIONNAIRE'); setError(''); }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'GESTIONNAIRE'
                    ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20'
                    : 'text-slate-500 hover:text-brand-blue'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Administration
              </button>
            </div>

            {/* Badge explicatif dynamique */}
            <div className="text-center">
              {activeTab === 'ADHERENT' ? (
                <span className="bg-brand-teal/10 text-brand-teal border border-brand-teal/20 text-[10px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                  Accès Adhérent — Santé & Prévention
                </span>
              ) : (
                <span className="bg-brand-ruby/10 text-brand-ruby border border-brand-ruby/20 text-[10px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                  Accès Gestionnaire — Administration FOSMEF
                </span>
              )}
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-3 p-3 bg-brand-ruby/5 text-brand-ruby text-xs rounded-xl flex items-center gap-2 border border-brand-ruby/20">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit} className="w-full space-y-3.5">
            <div>
              <label className="sr-only" htmlFor="email">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder={activeTab === 'ADHERENT' ? 'Email Adhérent' : 'Email Gestionnaire / Admin'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent text-sm transition-all bg-brand-gray/50 hover:bg-brand-gray/80 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="sr-only" htmlFor="password">Mot de passe</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent text-sm transition-all bg-brand-gray/50 hover:bg-brand-gray/80 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 text-white font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all duration-300 transform hover:translate-y-[-1px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                activeTab === 'GESTIONNAIRE' ? 'bg-brand-blue hover:bg-brand-blue-hover' : 'bg-brand-teal hover:bg-brand-teal-hover'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion...
                </>
              ) : activeTab === 'GESTIONNAIRE' ? "Connexion Espace Admin" : "Connexion Adhérent"}
            </button>

            {activeTab === 'ADHERENT' && (
              <div className="flex flex-col items-center gap-2.5 pt-2 text-xs">
                <a href="#" className="text-slate-500 hover:text-brand-teal transition-colors">
                  Mot de passe oublié ?
                </a>
                <div className="w-full flex items-center justify-center gap-2 my-0.5">
                  <span className="h-px bg-slate-100 flex-1"></span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">nouveau ?</span>
                  <span className="h-px bg-slate-100 flex-1"></span>
                </div>
                <Link
                  href="/register"
                  className="w-full py-2 border border-brand-teal/20 text-brand-teal hover:bg-brand-teal/5 font-bold uppercase tracking-wider rounded-xl transition-all duration-200 text-[11px] text-center flex items-center justify-center gap-1"
                >
                  Créer un compte Adhérent
                </Link>
              </div>
            )}
          </form>
        </div>

        {/* Footer en bas de page gauche */}
        <div className="text-center text-[10px] text-slate-400 mt-2">
          © {new Date().getFullYear()} FOSMEF. Tous droits réservés.
        </div>
      </div>

      {/* --- PARTIE DROITE (Illustration et présentation) --- */}
      <div className="hidden md:flex flex-col justify-center items-center w-[55%] lg:w-[60%] p-12 bg-gradient-to-br from-brand-blue via-brand-blue to-[#132a49] text-white h-full relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-ruby/5 rounded-full blur-3xl -ml-40 -mb-40"></div>
        
        <div className="max-w-xl text-center md:text-left space-y-6 z-10">
          <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-wide border-l-4 border-brand-teal pl-4">
            {activeTab === 'GESTIONNAIRE'
              ? "Interface de Gestion des Campagnes FOSMEF"
              : "Bienvenue dans votre espace santé & prévention"}
          </h2>
          <p className="text-sm lg:text-base text-slate-200 font-light leading-relaxed">
            {activeTab === 'GESTIONNAIRE'
              ? "Espace sécurisé réservé à l'équipe de gestion de la Fondation des Œuvres Sociales du Ministère de l'Économie et des Finances. Gérez les campagnes de prévention, suivez les réservations et contrôlez les accès."
              : "Un espace numérique dédié aux adhérents de la Fondation des Œuvres Sociales du personnel du Ministère de l'Économie et des Finances (FOSMEF). Réservez vos rendez-vous de dépistage, suivez nos campagnes de prévention et gérez votre dossier médical en toute simplicité."}
          </p>
          
          <div className="pt-8 flex justify-center">
            <div className="relative w-full max-w-md h-72 lg:h-96 drop-shadow-2xl">
              <Image
                src="/prevention_illustration.png"
                alt="Illustration Prévention Médicale FOSMEF"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
