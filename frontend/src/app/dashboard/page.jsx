'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdherentLayout from '@/components/AdherentLayout';
import { useAuth } from '@/context/AuthContext';
import { campagnesApi, reservationsApi } from '@/lib/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [campagnes, setCampagnes] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      campagnesApi.getAll().catch(() => []),
      reservationsApi.getMesReservations().catch(() => []),
    ]).then(([campData, resData]) => {
      setCampagnes(campData);
      setReservations(resData);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const meReservationsActives = reservations.filter(r => r.statut !== 'ANNULEE');
  const campagnesOuvertes = campagnes.filter(c => c.statut === 'EN_COURS' || c.statut === 'PLANIFIEE');
  const prochaineReservation = meReservationsActives[0];

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <AdherentLayout>
      {/* ── BANNIÈRE DE BIENVENUE ── */}
      <div className="relative bg-gradient-to-r from-brand-blue via-[#173257] to-brand-blue rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden mb-8">
        {/* Dégradés et effets de marque */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/15 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-ruby/15 rounded-full blur-3xl -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-teal text-xs font-bold uppercase tracking-wider border border-white/10">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse"></span>
              Espace Adhérent FOSMEF
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bonjour, <span className="text-brand-teal">{user?.prenom || 'Cher'} {user?.nom || 'Adhérent'}</span> ! 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
              Bienvenue sur votre tableau de bord de prévention médicale. Suivez vos réservations, inscrivez-vous aux campagnes de dépistage et gérez votre profil.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/campagnes"
              className="px-5 py-3 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-brand-teal/25 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Réserver une campagne
            </Link>
            <Link
              href="/profil"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-white/15 backdrop-blur-md transition-all duration-300"
            >
              Mon profil
            </Link>
          </div>
        </div>
      </div>

      {/* ── STATISTIQUES RAPIDES ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Card 1: Campagnes Ouvertes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Campagnes Actives</p>
            <p className="text-2xl font-extrabold text-brand-blue mt-0.5">{campagnesOuvertes.length}</p>
            <Link href="/campagnes" className="text-[11px] font-semibold text-brand-teal hover:underline mt-1 inline-block">
              Voir tout →
            </Link>
          </div>
        </div>

        {/* Card 2: Mes Réservations */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-ruby/10 flex items-center justify-center text-brand-ruby flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mes Réservations</p>
            <p className="text-2xl font-extrabold text-brand-ruby mt-0.5">{meReservationsActives.length}</p>
            <Link href="/mes-reservations" className="text-[11px] font-semibold text-brand-ruby hover:underline mt-1 inline-block">
              Accéder au suivi →
            </Link>
          </div>
        </div>

        {/* Card 3: N° PPM Adhérent */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">N° PPM Adhérent</p>
            <p className="text-sm font-extrabold text-brand-blue mt-1 truncate max-w-[120px]">
              {user?.ppm || 'PPM-FOSMEF'}
            </p>
            <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-1">
              Adhérent vérifié
            </span>
          </div>
        </div>

        {/* Card 4: Statut de Prévention */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Couverture Santé</p>
            <p className="text-sm font-extrabold text-slate-700 mt-1">Actif (2026)</p>
            <span className="text-[10px] text-slate-400 block mt-1">
              Protégé par la FOSMEF
            </span>
          </div>
        </div>

      </div>

      {/* ── SECTION PRINCIPALE 2 COLONNES ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Colonne Gauche (2/3): Prochaine réservation + Dernières Campagnes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Carte Prochaine Réservation */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-brand-blue flex items-center gap-2">
                <span className="w-1.5 h-5 bg-brand-ruby rounded-full"></span>
                Prochaine Réservation
              </h2>
              <Link href="/mes-reservations" className="text-xs font-bold text-brand-teal hover:underline">
                Voir toutes mes réservations →
              </Link>
            </div>

            {prochaineReservation ? (
              <div className="bg-gradient-to-br from-brand-gray to-white p-5 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
                      {prochaineReservation.statut}
                    </span>
                    <span className="text-xs text-slate-400">Réservé le {formatDate(prochaineReservation.dateReservation)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-blue">{prochaineReservation.campagneTitre}</h3>
                  {prochaineReservation.campagneLieu && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-light">
                      <svg className="w-4 h-4 text-brand-ruby" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {prochaineReservation.campagneLieu}
                    </p>
                  )}
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center min-w-[140px] flex-shrink-0 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Dates de la campagne</span>
                  <span className="text-xs font-bold text-brand-blue block mt-1">
                    {formatDate(prochaineReservation.campagneDateDebut)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">au {formatDate(prochaineReservation.campagneDateFin)}</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-brand-gray/50 rounded-2xl border border-dashed border-slate-200">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-slate-600">Aucune réservation à venir</p>
                <p className="text-[11px] text-slate-400 font-light mt-1 mb-4">Inscrivez-vous à une campagne de dépistage ouverte pour la FOSMEF.</p>
                <Link
                  href="/campagnes"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal text-white text-xs font-bold uppercase rounded-xl shadow-xs hover:bg-brand-teal-hover transition-colors"
                >
                  Découvrir les campagnes
                </Link>
              </div>
            )}
          </div>

          {/* Liste des Campagnes Disponibles */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-extrabold text-brand-blue flex items-center gap-2">
                <span className="w-1.5 h-5 bg-brand-teal rounded-full"></span>
                Campagnes à la Une
              </h2>
              <Link href="/campagnes" className="text-xs font-bold text-brand-teal hover:underline">
                Voir toutes ({campagnes.length}) →
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs">Chargement des campagnes...</div>
            ) : campagnesOuvertes.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">Aucune campagne ouverte actuellement.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {campagnesOuvertes.slice(0, 4).map((c) => {
                  const placesRestantes = c.placesTotales - c.placesReservees;
                  return (
                    <div key={c.id} className="p-4 rounded-xl border border-slate-100 bg-brand-gray/30 hover:bg-brand-gray/80 hover:border-brand-teal/30 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal">
                            {c.statut}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{placesRestantes} places dispo</span>
                        </div>
                        <h4 className="text-xs font-bold text-brand-blue mb-1 line-clamp-1">{c.titre}</h4>
                        {c.lieu && (
                          <p className="text-[11px] text-slate-400 font-light flex items-center gap-1 mb-3">
                            <svg className="w-3 h-3 text-brand-ruby" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {c.lieu}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/campagnes/${c.id}`}
                        className="w-full py-2 bg-brand-blue hover:bg-brand-teal text-white text-[11px] font-bold text-center rounded-lg transition-colors block mt-2"
                      >
                        Consulter & Réserver
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Colonne Droite (1/3): Conseils Prévention + Carte Adhérent Rapide */}
        <div className="space-y-6">

          {/* Carte Rose / Ruby: Prévention Santé FOSMEF */}
          <div className="bg-gradient-to-br from-brand-ruby via-[#9E1B50] to-[#7E1540] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Conseils & Dépistage FOSMEF</h3>
              <p className="text-xs font-light text-rose-100 leading-relaxed">
                Le dépistage précoce permet de prendre en charge plus de 90% des affections avant l'apparition des symptômes. Effectuez votre bilan annuel !
              </p>
              <div className="pt-2">
                <Link
                  href="/campagnes"
                  className="inline-block text-xs font-bold text-brand-ruby bg-white px-4 py-2 rounded-xl shadow-xs hover:bg-rose-50 transition-colors"
                >
                  Voir les campagnes ouvertes
                </Link>
              </div>
            </div>
          </div>

          {/* Carte Info Pratique & Assistance */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-blue flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Assistance & Support FOSMEF
            </h3>
            <div className="space-y-3 text-xs text-slate-500 font-light">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-brand-gray/50">
                <svg className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Centre d'appel prévention FOSMEF : <strong>080 100 2000</strong></span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-brand-gray/50">
                <svg className="w-4 h-4 text-brand-ruby flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contact support : <strong>contact@fosmef.ma</strong></span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </AdherentLayout>
  );
}
