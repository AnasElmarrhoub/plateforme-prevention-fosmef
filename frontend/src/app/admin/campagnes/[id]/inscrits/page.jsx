'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { campagnesApi, reservationsApi } from '@/lib/api';

export default function AdminInscritsPage() {
  const { id } = useParams();

  const [campagne, setCampagne] = useState(null);
  const [inscrits, setInscrits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      campagnesApi.getById(id).catch(() => null),
      reservationsApi.getReservationsByCampagne(id).catch(() => []),
    ]).then(([cData, rData]) => {
      setCampagne(cData);
      setInscrits(rData);
    }).catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatDateTime = (d) => new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const inscritsConfirmez = inscrits.filter(i => i.statut !== 'ANNULEE');

  return (
    <AdminLayout>
      {/* Fil d'Ariane */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-brand-teal transition-colors">Admin</Link>
        <span>/</span>
        <Link href="/admin/campagnes" className="hover:text-brand-teal transition-colors">Campagnes</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium truncate">Inscrits à la campagne #{id}</span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs">Chargement de la liste des inscrits...</div>
      ) : error || !campagne ? (
        <div className="p-4 bg-brand-ruby/5 border border-brand-ruby/20 text-brand-ruby text-xs rounded-xl">
          Campagne introuvable ou erreur de chargement.
        </div>
      ) : (
        <div className="space-y-6">
          {/* En-tête Campagne */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal mb-2 inline-block">
                {campagne.statut}
              </span>
              <h1 className="text-xl font-extrabold text-brand-blue">{campagne.titre}</h1>
              {campagne.lieu && (
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-brand-ruby" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {campagne.lieu} ({formatDate(campagne.dateDebut)} → {formatDate(campagne.dateFin)})
                </p>
              )}
            </div>

            <div className="bg-brand-gray/60 p-4 rounded-xl border border-slate-100 min-w-[200px] text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inscrits Confirmés</span>
              <span className="text-2xl font-extrabold text-brand-ruby block mt-0.5">{inscritsConfirmez.length} / {campagne.placesTotales}</span>
              <span className="text-[10px] text-slate-400">places réservées</span>
            </div>
          </div>

          {/* Tableau des inscrits */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-brand-blue flex items-center gap-2">
                <span className="w-1.5 h-5 bg-brand-teal rounded-full"></span>
                Liste des Adhérents Inscrits ({inscrits.length})
              </h2>
            </div>

            {inscrits.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Aucun adhérent ne s'est encore inscrit à cette campagne.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-gray border-b border-slate-100">
                      <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Adhérent</th>
                      <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">N° PPM</th>
                      <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Téléphone</th>
                      <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date Réservation</th>
                      <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inscrits.map((i) => (
                      <tr key={i.id} className={`hover:bg-brand-gray/40 transition-colors ${i.statut === 'ANNULEE' ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-brand-blue text-xs">{i.userName || 'Adhérent FOSMEF'}</p>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-600 font-mono">
                          {i.userEmail || '—'}
                        </td>
                        <td className="px-4 py-3.5 text-xs font-bold text-brand-teal">
                          {i.userPpm || '—'}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-600">
                          {i.userTelephone || '—'}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-400">
                          {formatDateTime(i.dateReservation)}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            i.statut === 'CONFIRMEE' ? 'bg-brand-teal/10 text-brand-teal border-brand-teal/20' :
                            'bg-brand-ruby/10 text-brand-ruby border-brand-ruby/20'
                          }`}>
                            {i.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
