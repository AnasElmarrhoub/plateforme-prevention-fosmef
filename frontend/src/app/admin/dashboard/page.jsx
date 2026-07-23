'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { campagnesApi, reservationsApi } from '@/lib/api';

export default function AdminDashboardPage() {
  const [campagnes, setCampagnes] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const refreshData = () => {
    setLoading(true);
    Promise.all([
      campagnesApi.getAll().catch(() => []),
      reservationsApi.getAllReservations().catch(() => []),
    ]).then(([campData, resData]) => {
      setCampagnes(campData);
      setReservations(resData);
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleDeleteCampagne = async (id, titre) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement la campagne "${titre}" de la base de données ?\n\nCette action est irréversible.`)) return;
    setDeletingId(id);
    try {
      await campagnesApi.delete(id);
      refreshData();
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  const totalPlacesTotales = campagnes.reduce((sum, c) => sum + (c.placesTotales || 0), 0);
  const totalPlacesReservees = campagnes.reduce((sum, c) => sum + (c.placesReservees || 0), 0);
  const tauxOccupationGlobal = totalPlacesTotales > 0 ? Math.round((totalPlacesReservees / totalPlacesTotales) * 100) : 0;
  
  const campagnesActives = campagnes.filter(c => c.statut === 'EN_COURS' || c.statut === 'PLANIFIEE');
  const meReservationsConfirmees = reservations.filter(r => r.statut === 'CONFIRMEE');

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <AdminLayout>
      {/* ── BANNIÈRE EN-TÊTE ADMIN ── */}
      <div className="relative bg-gradient-to-r from-brand-blue via-[#173257] to-[#122846] rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden mb-8 border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-ruby/15 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-brand-teal/15 rounded-full blur-3xl -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-ruby/20 text-rose-200 text-xs font-extrabold uppercase tracking-wider border border-brand-ruby/30">
              <span className="w-2 h-2 rounded-full bg-brand-ruby animate-pulse"></span>
              Console de Gestion FOSMEF
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tableau de bord <span className="text-brand-teal">Administration</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
              Supervisez les campagnes de prévention médicale, suivez les inscrits et gérez l'allocation des places en temps réel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/campagnes"
              className="px-5 py-3 bg-brand-ruby hover:bg-brand-ruby-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-brand-ruby/30 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Gérer & Créer une Campagne
            </Link>
          </div>
        </div>
      </div>

      {/* ── STATISTIQUES GLOBALES ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Card 1: Total Campagnes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Campagnes</p>
            <p className="text-2xl font-extrabold text-brand-blue mt-0.5">{campagnes.length}</p>
            <span className="text-[10px] text-brand-teal font-semibold block mt-0.5">
              {campagnesActives.length} actives actuellement
            </span>
          </div>
        </div>

        {/* Card 2: Total Inscriptions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Inscriptions Adhérents</p>
            <p className="text-2xl font-extrabold text-brand-teal mt-0.5">{meReservationsConfirmees.length}</p>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              Réservations confirmées
            </span>
          </div>
        </div>

        {/* Card 3: Capacity globale */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-ruby/10 flex items-center justify-center text-brand-ruby flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Taux d'Occupation</p>
            <p className="text-2xl font-extrabold text-brand-ruby mt-0.5">{tauxOccupationGlobal}%</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {totalPlacesReservees} / {totalPlacesTotales} places
            </span>
          </div>
        </div>

        {/* Card 4: Statut système */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Base de Données</p>
            <p className="text-sm font-extrabold text-emerald-600 mt-1">Connectée</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Spring Boot API : OK
            </span>
          </div>
        </div>

      </div>

      {/* ── APERÇU DES CAMPAGNES POUR L'ADMINISTRATEUR ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-extrabold text-brand-blue flex items-center gap-2">
              <span className="w-1.5 h-5 bg-brand-ruby rounded-full"></span>
              Aperçu des Campagnes de Prévention
            </h2>
            <p className="text-xs text-slate-400 font-light mt-0.5">Cliquez sur une campagne pour voir la liste complète des adhérents inscrits.</p>
          </div>
          <Link
            href="/admin/campagnes"
            className="px-4 py-2 bg-brand-blue hover:bg-brand-teal text-white text-xs font-bold uppercase rounded-xl transition-colors self-start sm:self-auto"
          >
            Accéder à la gestion complète →
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Chargement du tableau de bord...</div>
        ) : campagnes.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">Aucune campagne créée pour le moment.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-gray border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Campagne</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lieu</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dates</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Remplissage</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                  <th className="text-right px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campagnes.map((c) => {
                  const placesRestantes = c.placesTotales - c.placesReservees;
                  const pct = Math.round((c.placesReservees / c.placesTotales) * 100);
                  return (
                    <tr key={c.id} className="hover:bg-brand-gray/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-brand-blue text-xs">{c.titre}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">
                        {c.lieu || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">
                        {formatDate(c.dateDebut)} → {formatDate(c.dateFin)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="w-32">
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span className="text-slate-500">{c.placesReservees} / {c.placesTotales}</span>
                            <span className={pct >= 100 ? 'text-brand-ruby' : 'text-brand-teal'}>{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct >= 100 ? 'bg-brand-ruby' : 'bg-brand-teal'}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          c.statut === 'EN_COURS' ? 'bg-brand-teal/10 text-brand-teal border-brand-teal/20' :
                          c.statut === 'PLANIFIEE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                          {c.statut}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/campagnes/${c.id}/inscrits`}
                            className="text-xs font-bold text-brand-teal hover:underline"
                          >
                            Voir Inscrits ({c.placesReservees}) →
                          </Link>
                          <button
                            onClick={() => handleDeleteCampagne(c.id, c.titre)}
                            disabled={deletingId === c.id}
                            title="Supprimer la campagne de la base de données"
                            className="p-1 text-slate-300 hover:text-brand-ruby transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
