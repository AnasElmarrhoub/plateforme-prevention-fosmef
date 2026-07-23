'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { campagnesApi } from '@/lib/api';

export default function AdminCampagnesPage() {
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    lieu: '',
    dateDebut: '',
    dateFin: '',
    placesTotales: 50,
  });
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchCampagnes = () => {
    setLoading(true);
    campagnesApi.getAll()
      .then(setCampagnes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampagnes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!formData.titre || !formData.dateDebut || !formData.dateFin || !formData.placesTotales) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setCreating(true);
    try {
      await campagnesApi.create({
        titre: formData.titre,
        description: formData.description,
        lieu: formData.lieu,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin,
        placesTotales: parseInt(formData.placesTotales),
      });
      setFormSuccess(true);
      setShowModal(false);
      // Reset form
      setFormData({
        titre: '',
        description: '',
        lieu: '',
        dateDebut: '',
        dateFin: '',
        placesTotales: 50,
      });
      fetchCampagnes();
    } catch (err) {
      setFormError(err.message || 'Erreur lors de la création de la campagne.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, titre) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement la campagne "${titre}" de la base de données ?\n\nCette action est irréversible.`)) return;
    setDeletingId(id);
    try {
      await campagnesApi.delete(id);
      fetchCampagnes();
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <AdminLayout>
      {/* ── EN-TÊTE PAGE ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-brand-blue tracking-tight">Gestion des Campagnes de Prévention</h1>
          <p className="text-xs text-slate-500 mt-1">Créez, administrez et supprimez les campagnes de dépistage médical en direct dans PostgreSQL.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-brand-ruby hover:bg-brand-ruby-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-brand-ruby/20 transition-all duration-200 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle Campagne
        </button>
      </div>

      {formSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center justify-between">
          <span className="font-bold">✓ Nouvelle campagne enregistrée avec succès dans la base de données PostgreSQL !</span>
          <button onClick={() => setFormSuccess(false)} className="text-emerald-500 font-bold hover:underline">Fermer</button>
        </div>
      )}

      {/* ── LISTE DES CAMPAGNES ── */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs">Chargement des campagnes...</div>
      ) : error ? (
        <div className="p-4 bg-brand-ruby/5 border border-brand-ruby/20 text-brand-ruby text-xs rounded-xl">{error}</div>
      ) : campagnes.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-100">
          <p className="font-semibold text-slate-600 mb-2">Aucune campagne configurée en base de données</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-brand-ruby text-white text-xs font-bold uppercase rounded-xl"
          >
            Créer la première campagne
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {campagnes.map((c) => {
            const placesRestantes = c.placesTotales - c.placesReservees;
            const pct = Math.round((c.placesReservees / c.placesTotales) * 100);

            return (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <div className={`h-1.5 w-full ${c.statut === 'EN_COURS' ? 'bg-brand-teal' : c.statut === 'PLANIFIEE' ? 'bg-amber-400' : 'bg-slate-300'}`} />

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue">
                        ID: #{c.id}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          c.statut === 'EN_COURS' ? 'bg-brand-teal/10 text-brand-teal border-brand-teal/20' :
                          c.statut === 'PLANIFIEE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                          {c.statut}
                        </span>
                        <button
                          onClick={() => handleDelete(c.id, c.titre)}
                          disabled={deletingId === c.id}
                          title="Supprimer la campagne de la base de données"
                          className="p-1 text-slate-300 hover:text-brand-ruby transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-brand-blue text-sm mb-2">{c.titre}</h3>

                    {c.description && (
                      <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-2 mb-3">
                        {c.description}
                      </p>
                    )}

                    <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                      {c.lieu && (
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-brand-ruby flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span>{c.lieu}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(c.dateDebut)} au {formatDate(c.dateFin)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Gauge */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex justify-between text-[11px] font-bold mb-1.5">
                      <span className="text-slate-500">Réservations</span>
                      <span className={pct >= 100 ? 'text-brand-ruby' : 'text-brand-teal'}>
                        {c.placesReservees} / {c.placesTotales} places ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                      <div
                        className={`h-full rounded-full ${pct >= 100 ? 'bg-brand-ruby' : 'bg-brand-teal'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/campagnes/${c.id}/inscrits`}
                        className="flex-1 text-center py-2 bg-brand-blue hover:bg-brand-teal text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                      >
                        Inscrits →
                      </Link>
                      <button
                        onClick={() => handleDelete(c.id, c.titre)}
                        disabled={deletingId === c.id}
                        className="px-3 py-2 bg-rose-50 hover:bg-brand-ruby text-brand-ruby hover:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer border border-rose-200/60 disabled:opacity-50"
                        title="Supprimer la campagne de la base de données"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>{deletingId === c.id ? '...' : 'Supprimer'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL CRÉATION DE CAMPAGNE ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full relative overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-base font-extrabold text-brand-blue flex items-center gap-2">
                <span className="w-1.5 h-5 bg-brand-ruby rounded-full"></span>
                Nouvelle Campagne de Prévention
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer">×</button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-brand-ruby/5 border border-brand-ruby/20 text-brand-ruby text-xs rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Titre de la campagne *</label>
                <input
                  name="titre"
                  type="text"
                  required
                  value={formData.titre}
                  onChange={handleChange}
                  placeholder="Ex: Campagne Dépistage Vision & Diabète 2026"
                  className="w-full px-3.5 py-2.5 bg-white text-slate-800 font-semibold border border-slate-300 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Objectif et description de la campagne..."
                  className="w-full px-3.5 py-2.5 bg-white text-slate-800 font-semibold border border-slate-300 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Lieu (Ville / Centre médical)</label>
                <input
                  name="lieu"
                  type="text"
                  value={formData.lieu}
                  onChange={handleChange}
                  placeholder="Ex: Centre Médical FOSMEF Rabat"
                  className="w-full px-3.5 py-2.5 bg-white text-slate-800 font-semibold border border-slate-300 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Date de début *</label>
                  <input
                    name="dateDebut"
                    type="date"
                    required
                    value={formData.dateDebut}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white text-slate-800 font-semibold border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Date de fin *</label>
                  <input
                    name="dateFin"
                    type="date"
                    required
                    value={formData.dateFin}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white text-slate-800 font-semibold border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Nombre de places totales *</label>
                <input
                  name="placesTotales"
                  type="number"
                  min="1"
                  required
                  value={formData.placesTotales}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white text-slate-800 font-semibold border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all shadow-2xs"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 bg-brand-ruby hover:bg-brand-ruby-hover text-white text-xs font-bold uppercase rounded-xl disabled:opacity-60"
                >
                  {creating ? 'Création en cours...' : 'Créer la Campagne'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
