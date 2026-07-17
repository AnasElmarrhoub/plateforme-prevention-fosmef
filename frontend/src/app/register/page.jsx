'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
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
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
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

    console.log('Inscription en cours...', formData);
    setSuccess(true);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-tr from-[#2c4786] to-[#4068bd] p-4 font-sans text-gray-800 overflow-hidden">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden my-8">
        
        {/* LOGOS ET EN-TÊTE */}
        <div className="bg-gray-50 border-b border-gray-100 p-6 flex flex-col items-center sm:flex-row sm:justify-between gap-4">
          <Image
            src="/ministere-logo.png"
            alt="Ministère de l'Éducation Nationale"
            width={180}
            height={55}
            priority
            className="object-contain"
          />
          <Image
            src="/fos-logo.png"
            alt="Logo FOSMEF"
            width={120}
            height={55}
            priority
            className="object-contain"
          />
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Création de Compte Adhérent</h1>
            <p className="text-sm text-gray-500 mt-1">
              Inscrivez-vous pour accéder à l'espace de réservation et de suivi médical
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-md flex items-center gap-2 border border-red-200">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-md flex flex-col gap-2 border border-green-200">
              <div className="flex items-center gap-2 font-semibold">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Compte créé avec succès !
              </div>
              <p>Votre demande d'inscription a été enregistrée. Vous pouvez maintenant vous connecter.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Grille 2 Colonnes sur PC, 1 sur Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Informations personnelles */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1" htmlFor="nom">
                    Nom
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Ex: Alami"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1" htmlFor="prenom">
                    Prénom
                  </label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Ex: Mohamed"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1" htmlFor="email">
                    Adresse Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="mohamed.alami@example.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1" htmlFor="ppm">
                    N° PPM (Identifiant Adhérent)
                  </label>
                  <input
                    id="ppm"
                    name="ppm"
                    type="text"
                    required
                    value={formData.ppm}
                    onChange={handleChange}
                    placeholder="Ex: PPM-897321"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Téléphone et Sécurité */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1" htmlFor="telephone">
                    N° de Téléphone
                  </label>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    required
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="06XXXXXXXX / 07XXXXXXXX"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1" htmlFor="password">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1" htmlFor="confirmPassword">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

            </div>

            {/* Case à cocher pour RGPD / CGU */}
            <div className="flex items-start">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-xs text-gray-500 leading-relaxed">
                J'accepte les conditions générales d'utilisation et autorise le traitement de mes données 
                conformément à la loi 09-08 relative à la protection des personnes physiques à l'égard du 
                traitement des données à caractère personnel (Déclaration CNDP).
              </label>
            </div>

            {/* Bouton de soumission */}
            <div>
              <button
                type="submit"
                className="w-full py-3 bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold uppercase tracking-wider rounded-md shadow-md transition-colors duration-200 text-sm"
              >
                S'inscrire
              </button>
            </div>

            {/* Lien retour de connexion */}
            <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
              Déjà inscrit ?{' '}
              <Link href="/" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors hover:underline">
                Se connecter
              </Link>
            </div>

          </form>
        </div>

        {/* Pied de page institutionnel */}
        <div className="bg-gray-50 p-4 text-center text-[10px] text-gray-400 border-t border-gray-100">
          © {new Date().getFullYear()} Fondation des Œuvres Sociales de l'Éducation-Formation (FOSMEF).
        </div>
      </div>
    </div>
  );
}
