'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Connexion...', { login, password });
    // Logique de connexion à implémenter
  };

  return (
    <div className="flex h-screen w-screen flex-col md:flex-row bg-white font-sans text-gray-800 overflow-hidden">
      
      {/* --- PARTIE GAUCHE (Formulaire de connexion) --- */}
      <div className="flex flex-col justify-between w-full h-full md:w-[45%] lg:w-[40%] p-8 lg:p-12 xl:p-16 bg-white overflow-hidden">
        
        {/* Logo Ministère en haut */}
        <div className="flex justify-center mb-8">
          <Image
            src="/ministere-logo.png"
            alt="Ministère de l'Éducation Nationale"
            width={240}
            height={80}
            priority
            className="object-contain"
          />
        </div>

        {/* Formulaire et Logo FOSMEF au centre */}
        <div className="my-auto flex flex-col items-center md:items-stretch">
          
          {/* Logo FOSMEF */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/fos-logo.png"
              alt="Logo FOSMEF"
              width={160}
              height={75}
              priority
              className="object-contain mb-2"
            />
            <div className="text-center">
              <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Espace Santé & Prévention
              </span>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-4">
            <div>
              <label className="sr-only" htmlFor="login">Identifiant (Email / PPM)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </span>
                <input
                  id="login"
                  type="text"
                  placeholder="Identifiant (Email / PPM)"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="sr-only" htmlFor="password">Mot de passe</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </span>
                <input
                  id="password"
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold uppercase tracking-wider rounded-md shadow-md transition-colors duration-200"
            >
              Connexion
            </button>

            <div className="flex flex-col items-center gap-3 pt-3 text-xs text-gray-500">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Mot de passe oublié ?
              </a>
              <div className="w-full flex items-center justify-center gap-2 my-1">
                <span className="h-px bg-gray-200 w-1/4"></span>
                <span className="text-[10px] text-gray-400 uppercase">nouveau ?</span>
                <span className="h-px bg-gray-200 w-1/4"></span>
              </div>
              <Link
                href="/register"
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors hover:underline text-sm"
              >
                Créer un compte
              </Link>
            </div>
          </form>
        </div>

        {/* Footer en bas de page gauche */}
        <div className="text-center text-[10px] text-gray-400 mt-8">
          © {new Date().getFullYear()} FOSMEF. Tous droits réservés.
        </div>
      </div>

      {/* --- PARTIE DROITE (Illustration et présentation) --- */}
      <div className="hidden md:flex flex-col justify-center items-center w-[55%] lg:w-[60%] p-12 bg-gradient-to-tr from-[#2c4786] to-[#4068bd] text-white h-full overflow-hidden">
        <div className="max-w-xl text-center md:text-left space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight tracking-wide">
            Bienvenue dans votre espace santé & prévention
          </h2>
          <p className="text-base lg:text-lg text-blue-100 font-light leading-relaxed">
            Un espace numérique dédié aux adhérents de la Fondation des Œuvres Sociales de l'Éducation-Formation. Réservez vos rendez-vous de dépistage, suivez nos campagnes de prévention et gérez votre dossier médical en toute simplicité.
          </p>
          
          <div className="pt-8 flex justify-center">
            {/* L'illustration prevention_illustration.png fournie dans le répertoire public */}
            <div className="relative w-full max-w-md h-72 lg:h-96">
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
