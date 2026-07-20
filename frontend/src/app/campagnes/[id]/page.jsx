'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AdherentLayout from '@/components/AdherentLayout';
import { campagnesApi, reservationsApi } from '@/lib/api';

const STATUT_CONFIG = {
  PLANIFIEE: { label: 'Planifiée', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-200' },
  EN_COURS:  { label: 'En cours',  bg: 'bg-brand-teal/5', text: 'text-brand-teal', dot: 'bg-brand-teal', border: 'border-brand-teal/20' },
  TERMINEE:  { label: 'Terminée', bg: 'bg-slate-50', text: 'text-slate-500', dot: 'bg-slate-400', border: 'border-slate-200' },
  ANNULEE:   { label: 'Annulée',  bg: 'bg-brand-ruby/5', text: 'text-brand-ruby', dot: 'bg-brand-ruby', border: 'border-brand-ruby/20' },
};

export default function CampagneDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [campagne, setCampagne] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reserving, setReserving] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationError, setReservationError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    campagnesApi.getById(id)
      .then(setCampagne)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReserver = async () => {
    setReserving(true);
    setReservationError('');
    try {
      await reservationsApi.reserver(parseInt(id));
      setReservationSuccess(true);
      setShowModal(false);
      // Refresh campagne data to update places
      const updated = await campagnesApi.getById(id);
      setCampagne(updated);
    } catch (err) {
      setReservationError(err.message || 'Erreur lors de la réservation.');
      setShowModal(false);
    } finally {
      setReserving(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formatDateShort = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  if (loading) {
    return (
      <AdherentLayout>
        <div className="flex items-center justify-center h-full">
          <svg className="animate-spin w-8 h-8 text-brand-teal" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </AdherentLayout>
    );
  }

  if (error || !campagne) {
    return (
      <AdherentLayout>
        <div className="p-6 bg-brand-ruby/5 border border-brand-ruby/20 text-brand-ruby rounded-2xl text-sm">
          <p className="font-semibold mb-1">Campagne introuvable</p>
          <p className="text-xs mb-4">{error}</p>
          <Link href="/campagnes" className="text-xs font-bold underline">← Retour aux campagnes</Link>
        </div>
      </AdherentLayout>
    );
  }

  const placesRestantes = campagne.placesTotales - campagne.placesReservees;
  const pourcentage = Math.round((campagne.placesReservees / campagne.placesTotales) * 100);
  const isComplet = placesRestantes <= 0;
  const isOuverte = campagne.statut === 'EN_COURS' || campagne.statut === 'PLANIFIEE';
  const cfg = STATUT_CONFIG[campagne.statut] || STATUT_CONFIG.PLANIFIEE;

  return (
    <AdherentLayout>
      {/* Fil d'Ariane */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link href="/campagnes" className="hover:text-brand-teal transition-colors">Campagnes</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium truncate">{campagne.titre}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Colonne principale ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Bannière titre */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className={`h-2 ${
              campagne.statut === 'EN_COURS' ? 'bg-gradient-to-r from-brand-teal to-brand-blue' :
              campagne.statut === 'ANNULEE' ? 'bg-brand-ruby' :
              campagne.statut === 'TERMINEE' ? 'bg-slate-300' : 'bg-gradient-to-r from-amber-400 to-amber-500'
            }`} />
            <div className="p-6">
              <div className="flex flex-wrap items-start gap-3 mb-4">
                <h1 className="text-xl font-extrabold text-brand-blue flex-1">{campagne.titre}</h1>
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`}></span>
                  {cfg.label}
                </span>
              </div>
              {campagne.description && (
                <p className="text-sm text-slate-600 leading-relaxed font-light">{campagne.description}</p>
              )}
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <h2 className="text-sm font-bold text-brand-blue mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-teal rounded-full"></span>
              Informations de la campagne
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-brand-gray/60 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date de début</p>
                  <p className="text-sm font-semibold text-brand-blue capitalize">{formatDateShort(campagne.dateDebut)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-brand-gray/60 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date de fin</p>
                  <p className="text-sm font-semibold text-brand-blue capitalize">{formatDateShort(campagne.dateFin)}</p>
                </div>
              </div>
              {campagne.lieu && (
                <div className="flex items-start gap-3 p-3 bg-brand-gray/60 rounded-xl sm:col-span-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-ruby/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-brand-ruby" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lieu</p>
                    <p className="text-sm font-semibold text-brand-blue">{campagne.lieu}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          {reservationSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-3 text-sm">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-bold">Réservation confirmée !</p>
                <p className="text-xs mt-0.5">Votre place a été réservée avec succès.
                  <button onClick={() => router.push('/mes-reservations')} className="ml-1 underline font-semibold">Voir mes réservations →</button>
                </p>
              </div>
            </div>
          )}

          {reservationError && (
            <div className="p-4 bg-brand-ruby/5 border border-brand-ruby/20 text-brand-ruby rounded-2xl flex items-center gap-3 text-sm">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {reservationError}
            </div>
          )}
        </div>

        {/* ── Panneau latéral Réservation ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 sticky top-0">
            <h2 className="text-sm font-bold text-brand-blue mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-ruby rounded-full"></span>
              Disponibilité
            </h2>

            {/* Gauge */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-500">Places réservées</span>
                <span className={isComplet ? 'text-brand-ruby' : 'text-brand-teal'}>
                  {campagne.placesReservees} / {campagne.placesTotales}
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${pourcentage >= 100 ? 'bg-brand-ruby' : pourcentage > 70 ? 'bg-amber-400' : 'bg-brand-teal'}`}
                  style={{ width: `${Math.min(pourcentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                <span>{pourcentage}% rempli</span>
                <span className={`font-bold ${isComplet ? 'text-brand-ruby' : 'text-emerald-600'}`}>
                  {isComplet ? '0 place disponible' : `${placesRestantes} place${placesRestantes > 1 ? 's' : ''} restante${placesRestantes > 1 ? 's' : ''}`}
                </span>
              </div>
            </div>

            {/* Action button */}
            {isOuverte && !isComplet && !reservationSuccess ? (
              <button
                onClick={() => setShowModal(true)}
                disabled={reserving}
                className="w-full py-3 bg-brand-teal hover:bg-brand-teal-hover text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-xs hover:shadow-md hover:shadow-brand-teal/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Réserver ma place
              </button>
            ) : reservationSuccess ? (
              <div className="w-full py-3 bg-emerald-50 text-emerald-700 font-bold text-sm text-center rounded-xl border border-emerald-200">
                ✓ Réservé
              </div>
            ) : isComplet ? (
              <div className="w-full py-3 bg-brand-ruby/10 text-brand-ruby font-bold text-sm text-center rounded-xl border border-brand-ruby/20">
                Campagne complète
              </div>
            ) : (
              <div className="w-full py-3 bg-slate-100 text-slate-500 font-bold text-sm text-center rounded-xl">
                Réservation indisponible
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link
                href="/campagnes"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-teal transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour aux campagnes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal de confirmation ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-center w-16 h-16 bg-brand-teal/10 rounded-2xl mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-extrabold text-brand-blue text-center mb-2">Confirmer la réservation</h3>
            <p className="text-sm text-slate-500 text-center font-light mb-1">
              Vous êtes sur le point de réserver une place pour :
            </p>
            <p className="text-sm font-bold text-brand-teal text-center mb-6">{campagne.titre}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-semibold rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleReserver}
                disabled={reserving}
                className="flex-1 py-2.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {reserving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Réservation...
                  </>
                ) : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdherentLayout>
  );
}
