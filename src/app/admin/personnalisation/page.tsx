'use client';

import { useState, useEffect } from 'react';
import SectionItemEditor from '@/components/admin/SectionItemEditor';
import { SectionModel } from '@/components/sections/DynamicSectionRenderer';
import {
  Palette,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminCustomizerPage() {
  const [sections, setSections] = useState<SectionModel[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch sections
  useEffect(() => {
    async function loadSections() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/sections?page=home');
        const data = await res.json();
        if (data.sections && Array.isArray(data.sections)) {
          setSections(data.sections);
        }
      } catch (err) {
        console.error('Failed to load sections:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSections();
  }, []);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    // update position
    updated.forEach((s, idx) => {
      s.position = idx;
    });
    setSections(updated);
    setSelectedIndex(index - 1);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    updated.forEach((s, idx) => {
      s.position = idx;
    });
    setSections(updated);
    setSelectedIndex(index + 1);
  };

  const toggleVisibility = (index: number) => {
    const updated = [...sections];
    updated[index].isActive = !updated[index].isActive;
    setSections(updated);
  };

  const handleUpdateSection = (updatedItem: SectionModel) => {
    const updated = [...sections];
    updated[selectedIndex] = updatedItem;
    setSections(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur de sauvegarde');
      }
      setStatusMessage({ type: 'success', text: 'Modifications enregistrées avec succès !' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Impossible d’enregistrer' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
      </div>
    );
  }

  const currentSection = sections[selectedIndex];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                Personnalisation du Thème
              </h1>
              <p className="text-xs sm:text-sm text-stone-500">
                Gérez l'ordre des sections, modifiez les textes bilingues et les visuels de la boutique en direct.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/fr"
            target="_blank"
            className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <span>Voir le site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publier les changements</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert toast */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sections List & Sorting */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Sections de la Page d'Accueil</span>
            </div>
            <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-semibold">
              {sections.length} blocs
            </span>
          </div>

          <div className="space-y-2">
            {sections.map((section, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={section.id || section.key}
                  className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-400 ring-1 ring-amber-400 shadow-xs'
                      : 'bg-stone-50/50 border-stone-200 hover:bg-stone-100/80'
                  }`}
                  onClick={() => setSelectedIndex(idx)}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-xs font-black text-stone-400 w-4 text-center">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-amber-900' : 'text-stone-800'}`}>
                        {section.title}
                      </p>
                      <span className="text-[10px] uppercase font-semibold text-stone-400">
                        {section.type}
                      </span>
                    </div>
                  </div>

                  {/* Actions: visibility and ordering */}
                  <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => toggleVisibility(idx)}
                      className={`p-1.5 rounded-lg transition ${
                        section.isActive
                          ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                          : 'text-stone-300 hover:text-stone-600'
                      }`}
                      title={section.isActive ? 'Masquer' : 'Afficher'}
                    >
                      {section.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveUp(idx)}
                      className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Monter"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sections.length - 1}
                      onClick={() => moveDown(idx)}
                      className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Descendre"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Section Editor */}
        <div className="lg:col-span-8">
          {currentSection ? (
            <SectionItemEditor
              section={currentSection}
              onChange={handleUpdateSection}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
              Sélectionnez une section à gauche pour la personnaliser.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
