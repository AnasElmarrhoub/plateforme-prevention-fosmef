'use client';

import React, { useEffect, useState } from 'react';
import AdherentLayout from '@/components/AdherentLayout';
import { reservationsApi } from '@/lib/api';

const STATUT_CONFIG = {
  CONFIRMEE:  { label: 'Confirmée',   bg: 'bg-brand-teal/5',  text: 'text-brand-teal',  dot: 'bg-brand-teal',  border: 'border-brand-teal/20'  },
  EN_ATTENTE: { label: 'En attente',  bg: 'bg-amber-50',      text: 'text-amber-700',   dot: 'bg-amber-400',   border: 'border-amber-200'       },
  ANNULEE:    { label: 'Annulée',     bg: 'bg-brand-ruby/5',  text: 'text-brand-ruby',  dot: 'bg-brand-ruby',  border: 'border-brand-ruby/20'   },
};

function StatutBadge({ statut }) {
  const cfg = STATUT_CONFIG[statut] || STATUT_CONFIG.EN_ATTENTE;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  );
}

export default function MesReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState('');

  const fetchReservations = () => {
    setLoading(true);
    reservationsApi.getMesReservations()
      .then(setReservations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReservations(); }, []);

  const handleAnnuler = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;
    setCancellingId(id);
    setCancelError('');
    try {
      await reservationsApi.annuler(id);
      fetchReservations();
    } catch (err) {
      setCancelError(err.message || "Erreur lors de l'annulation.");
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatDateTime = (d) => new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const actives = reservations.filter(r => r.statut !== 'ANNULEE');
  const annulees = reservations.filter(r => r.statut === 'ANNULEE');

  return (
    <AdherentLayout>
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-brand-blue tracking-tight">Mes Réservations</h1>
        <p className="text-xs text-slate-500 mt-1">
          Suivez l'état de vos réservations aux campagnes de prévention médicale.
        </p>
      </div>

      {/* Stats rapides */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-brand-blue">{reservations.length}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total</p>
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-brand-teal">{actives.length}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Actives</p>
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-ruby/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-ruby" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-brand-ruby">{annulees.length}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Annulées</p>
            </div>
          </div>
        </div>
      )}

      {/* Erreur annulation */}
      {cancelError && (
        <div className="mb-4 p-3 bg-brand-ruby/5 border border-brand-ruby/20 text-brand-ruby rounded-xl text-xs flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {cancelError}
        </div>
      )}

      {/* Chargement */}
      {loading && (
        <div className="flex items-center justify-center h-48">
          <svg className="animate-spin w-8 h-8 text-brand-teal" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}

      {/* Erreur de chargement */}
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

      {/* Aucune réservation */}
      {!loading && !error && reservations.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium">Vous n'avez pas encore de réservation.</p>
          <a href="/campagnes" className="text-xs font-bold text-brand-teal hover:underline">
            Parcourir les campagnes →
          </a>
        </div>
      )}

      {/* Liste des réservations */}
      {!loading && !error && reservations.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-gray border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Campagne</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Lieu</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Date campagne</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Réservé le</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                  <th className="text-right px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reservations.map((r) => (
                  <tr key={r.id} className={`hover:bg-brand-gray/40 transition-colors ${r.statut === 'ANNULEE' ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-brand-blue text-xs">{r.campagneTitre}</p>
                      {r.campagneDescription && (
                        <p className="text-[11px] text-slate-400 font-light mt-0.5 line-clamp-1">{r.campagneDescription}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 hidden sm:table-cell">
                      {r.campagneLieu || <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 hidden md:table-cell">
                      <span>{formatDate(r.campagneDateDebut)}</span>
                      <span className="text-slate-300 mx-1">→</span>
                      <span>{formatDate(r.campagneDateFin)}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-400 hidden lg:table-cell">
                      {formatDateTime(r.dateReservation)}
                    </td>
                    <td className="px-4 py-4">
                      <StatutBadge statut={r.statut} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.statut !== 'ANNULEE' ? (
                        <button
                          onClick={() => handleAnnuler(r.id)}
                          disabled={cancellingId === r.id}
                          className="text-[11px] font-bold text-brand-ruby hover:underline hover:text-brand-ruby-hover transition-colors disabled:opacity-50"
                        >
                          {cancellingId === r.id ? 'Annulation...' : 'Annuler'}
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdherentLayout>
  );
}
