'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdherentLayout from '@/components/AdherentLayout';
import { campagnesApi } from '@/lib/api';

const STATUT_CONFIG = {
  PLANIFIEE: { label: 'Planifiée', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-200' },
  EN_COURS:  { label: 'En cours',  bg: 'bg-brand-teal/5', text: 'text-brand-teal', dot: 'bg-brand-teal', border: 'border-brand-teal/20' },
  TERMINEE:  { label: 'Terminée', bg: 'bg-slate-50', text: 'text-slate-500', dot: 'bg-slate-400', border: 'border-slate-200' },
  ANNULEE:   { label: 'Annulée',  bg: 'bg-brand-ruby/5', text: 'text-brand-ruby', dot: 'bg-brand-ruby', border: 'border-brand-ruby/20' },
};

function StatutBadge({ statut }) {
  const cfg = STATUT_CONFIG[statut] || STATUT_CONFIG.PLANIFIEE;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  );
}

function CampagneCard({ campagne }) {
  const placesRestantes = campagne.placesTotales - campagne.placesReservees;
  const pourcentage = Math.round((campagne.placesReservees / campagne.placesTotales) * 100);
  const isComplet = placesRestantes <= 0;
  const isOuverte = campagne.statut === 'EN_COURS' || campagne.statut === 'PLANIFIEE';

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col overflow-hidden group">
      {/* Top accent bar based on statut */}
      <div className={`h-1 w-full ${
        campagne.statut === 'EN_COURS' ? 'bg-brand-teal' :
        campagne.statut === 'ANNULEE' ? 'bg-brand-ruby' :
        campagne.statut === 'TERMINEE' ? 'bg-slate-300' : 'bg-amber-400'
      }`} />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-bold text-brand-blue text-sm leading-snug group-hover:text-brand-teal transition-colors">
            {campagne.titre}
          </h3>
          <StatutBadge statut={campagne.statut} />
        </div>

        {campagne.description && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 font-light">
            {campagne.description}
          </p>
        )}

        {/* Infos */}
        <div className="space-y-2 text-xs text-slate-500 mb-4">
          {campagne.lieu && (
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{campagne.lieu}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(campagne.dateDebut)} → {formatDate(campagne.dateFin)}</span>
          </div>
        </div>

        {/* Jauge de remplissage */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] font-semibold mb-1.5">
            <span className="text-slate-500">Places disponibles</span>
            <span className={isComplet ? 'text-brand-ruby' : 'text-brand-teal'}>
              {isComplet ? 'COMPLET' : `${placesRestantes} / ${campagne.placesTotales}`}
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pourcentage >= 100 ? 'bg-brand-ruby' : pourcentage > 70 ? 'bg-amber-400' : 'bg-brand-teal'}`}
              style={{ width: `${Math.min(pourcentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Bouton */}
        <div className="mt-auto">
          {isOuverte && !isComplet ? (
            <Link
              href={`/campagnes/${campagne.id}`}
              className="block w-full text-center py-2.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-brand-teal/20"
            >
              Voir & Réserver
            </Link>
          ) : isComplet ? (
            <button disabled className="block w-full text-center py-2.5 bg-brand-ruby/10 text-brand-ruby text-xs font-bold uppercase tracking-wider rounded-xl cursor-not-allowed">
              Complet
            </button>
          ) : (
            <Link
              href={`/campagnes/${campagne.id}`}
              className="block w-full text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200"
            >
              Voir le détail
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CampagnesPage() {
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtre, setFiltre] = useState('TOUS');

  useEffect(() => {
    campagnesApi.getAll()
      .then(setCampagnes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtreOptions = [
    { key: 'TOUS', label: 'Toutes' },
    { key: 'EN_COURS', label: 'En cours' },
    { key: 'PLANIFIEE', label: 'Planifiées' },
    { key: 'TERMINEE', label: 'Terminées' },
  ];

  const campagnesFiltrees = filtre === 'TOUS'
    ? campagnes
    : campagnes.filter((c) => c.statut === filtre);

  return (
    <AdherentLayout>
      {/* En-tête de section */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-brand-blue tracking-tight">Campagnes de Prévention</h1>
        <p className="text-xs text-slate-500 mt-1">Consultez et réservez votre place dans les campagnes de dépistage et de prévention médicale.</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filtreOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFiltre(opt.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              filtre === opt.key
                ? 'bg-brand-blue text-white border-brand-blue shadow-xs'
                : 'bg-white text-slate-500 border-slate-200 hover:border-brand-teal hover:text-brand-teal'
            }`}
          >
            {opt.label}
            {opt.key !== 'TOUS' && ` (${campagnes.filter(c => c.statut === opt.key).length})`}
            {opt.key === 'TOUS' && ` (${campagnes.length})`}
          </button>
        ))}
      </div>

      {/* Contenu */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <svg className="animate-spin w-8 h-8 text-brand-teal" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm">Chargement des campagnes...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-brand-ruby/5 border border-brand-ruby/20 text-brand-ruby rounded-2xl text-sm flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Erreur de chargement</p>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && campagnesFiltrees.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-sm gap-2">
          <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>Aucune campagne disponible pour ce filtre.</p>
        </div>
      )}

      {!loading && !error && campagnesFiltrees.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {campagnesFiltrees.map((c) => (
            <CampagneCard key={c.id} campagne={c} />
          ))}
        </div>
      )}
    </AdherentLayout>
  );
}
