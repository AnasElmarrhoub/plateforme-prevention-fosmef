'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    ppm: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!formData.agreeTerms) {
      setError('Vous devez accepter les conditions générales.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      await register({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        ppm: formData.ppm,
        telephone: formData.telephone,
        password: formData.password,
      });
      // redirect handled inside useAuth
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-brand-blue via-brand-blue to-[#132a49] font-sans text-slate-800 relative overflow-hidden">
      
      {/* Cercles décoratifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-ruby/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        
        {/* LOGOS EN-TÊTE */}
        <div className="bg-brand-gray border-b border-slate-100 px-6 py-3 flex flex-col items-center sm:flex-row sm:justify-between gap-2">
          <Image src="/ministere-logo.png" alt="Ministère de l'Éducation Nationale" width={160} height={45} priority className="object-contain" />
          <Image src="/fos-logo.png" alt="Logo FOSMEF" width={100} height={45} priority className="object-contain" />
        </div>

        <div className="px-8 py-5">
          <div className="text-center mb-5">
            <h1 className="text-xl font-extrabold text-brand-blue tracking-tight">Création de Compte Adhérent</h1>
            <p className="text-xs text-slate-500 mt-1 font-light">
              Inscrivez-vous pour accéder à l'espace de réservation et de suivi médical de la FOSMEF
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-brand-ruby/5 text-brand-ruby text-xs rounded-xl flex items-center gap-2 border border-brand-ruby/20">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              
              {/* Colonne gauche */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="nom">Nom</label>
                  <input id="nom" name="nom" type="text" required value={formData.nom} onChange={handleChange}
                    placeholder="Ex: Alami"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm bg-brand-gray/50 hover:bg-brand-gray/80 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="prenom">Prénom</label>
                  <input id="prenom" name="prenom" type="text" required value={formData.prenom} onChange={handleChange}
                    placeholder="Ex: Mohamed"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm bg-brand-gray/50 hover:bg-brand-gray/80 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="email">Adresse Email</label>
                  <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
                    placeholder="alami@example.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm bg-brand-gray/50 hover:bg-brand-gray/80 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="ppm">N° PPM</label>
                  <input id="ppm" name="ppm" type="text" value={formData.ppm} onChange={handleChange}
                    placeholder="Ex: PPM-897321"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm bg-brand-gray/50 hover:bg-brand-gray/80 focus:bg-white transition-all" />
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="telephone">Téléphone</label>
                  <input id="telephone" name="telephone" type="tel" value={formData.telephone} onChange={handleChange}
                    placeholder="06XXXXXXXX"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm bg-brand-gray/50 hover:bg-brand-gray/80 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="password">Mot de passe</label>
                  <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange}
                    placeholder="Min. 6 caractères"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm bg-brand-gray/50 hover:bg-brand-gray/80 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="confirmPassword">Confirmer mot de passe</label>
                  <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm bg-brand-gray/50 hover:bg-brand-gray/80 focus:bg-white transition-all" />
                </div>
              </div>
            </div>

            {/* RGPD */}
            <div className="flex items-start bg-brand-gray/40 px-3 py-2.5 rounded-xl border border-slate-100">
              <input id="agreeTerms" name="agreeTerms" type="checkbox" required checked={formData.agreeTerms} onChange={handleChange}
                className="h-4 w-4 text-brand-teal border-slate-200 rounded focus:ring-brand-teal accent-brand-teal mt-0.5 flex-shrink-0" />
              <label htmlFor="agreeTerms" className="ml-3 text-[11px] text-slate-500 leading-relaxed font-light">
                J'accepte les conditions générales d'utilisation et le traitement de mes données (Loi 09-08 / Déclaration CNDP).
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-teal hover:bg-brand-teal-hover text-white font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all duration-300 transform hover:translate-y-[-1px] cursor-pointer text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Inscription en cours...
                </>
              ) : "S'inscrire"}
            </button>

            <div className="text-center text-xs text-slate-400 pt-1 border-t border-slate-100">
              Déjà inscrit ?{' '}
              <Link href="/" className="font-bold text-brand-teal hover:text-brand-teal-hover transition-colors hover:underline">
                Se connecter
              </Link>
            </div>
          </form>
        </div>

        {/* Pied de page */}
        <div className="bg-brand-gray px-8 py-2.5 text-center text-[10px] text-slate-400 border-t border-slate-100">
          © {new Date().getFullYear()} Fondation des Œuvres Sociales du personnel du Ministère de l'Économie et des Finances (FOSMEF). Tous droits réservés.
        </div>
      </div>
    </div>
  );
}
