'use client';

import { useState } from 'react';
import ImageUploader from './ImageUploader';
import { SectionModel } from '../sections/DynamicSectionRenderer';
import { Globe, Type, Image as ImageIcon, Link2, Sliders } from 'lucide-react';

interface SectionItemEditorProps {
  section: SectionModel;
  onChange: (updated: SectionModel) => void;
}

export default function SectionItemEditor({ section, onChange }: SectionItemEditorProps) {
  const [tab, setTab] = useState<'fr' | 'ar' | 'media'>('fr');

  const updateContent = (key: string, value: any) => {
    onChange({
      ...section,
      content: {
        ...section.content,
        [key]: value,
      },
    });
  };

  const updateItemInList = (index: number, field: string, value: any) => {
    const items = [...(section.content?.items || [])];
    items[index] = { ...items[index], [field]: value };
    updateContent('items', items);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
      {/* Editor Sub-header with Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            {section.type}
          </span>
          <h3 className="text-lg font-bold text-stone-900 mt-1">
            {section.title}
          </h3>
        </div>

        {/* Language & Settings Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setTab('fr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              tab === 'fr'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Français</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('ar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              tab === 'ar'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>العربية (RTL)</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('media')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              tab === 'media'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Médias & Liens</span>
          </button>
        </div>
      </div>

      {/* 1. HERO EDITOR */}
      {section.type === 'HERO' && (
        <div className="space-y-4">
          {tab === 'fr' && (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Titre Principal (Français)
                </label>
                <input
                  type="text"
                  value={section.content?.title_fr || ''}
                  onChange={(e) => updateContent('title_fr', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Sous-titre / Description (Français)
                </label>
                <textarea
                  rows={3}
                  value={section.content?.subtitle_fr || ''}
                  onChange={(e) => updateContent('subtitle_fr', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Texte du Bouton (Français)
                  </label>
                  <input
                    type="text"
                    value={section.content?.buttonText_fr || ''}
                    onChange={(e) => updateContent('buttonText_fr', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Badge d'accroche (Français)
                  </label>
                  <input
                    type="text"
                    value={section.content?.badge_fr || ''}
                    onChange={(e) => updateContent('badge_fr', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {tab === 'ar' && (
            <div dir="rtl" className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1 text-right">
                  العنوان الرئيسي (بالعربية)
                </label>
                <input
                  type="text"
                  value={section.content?.title_ar || ''}
                  onChange={(e) => updateContent('title_ar', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1 text-right">
                  الوصف التوضيحي (بالعربية)
                </label>
                <textarea
                  rows={3}
                  value={section.content?.subtitle_ar || ''}
                  onChange={(e) => updateContent('subtitle_ar', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-right"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1 text-right">
                    نص الزر الأساسي (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={section.content?.buttonText_ar || ''}
                    onChange={(e) => updateContent('buttonText_ar', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1 text-right">
                    الشارة الترويجية (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={section.content?.badge_ar || ''}
                    onChange={(e) => updateContent('badge_ar', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-right"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === 'media' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Lien de redirection du bouton principal
                </label>
                <input
                  type="text"
                  placeholder="/catalogue"
                  value={section.content?.buttonLink || ''}
                  onChange={(e) => updateContent('buttonLink', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <ImageUploader
                label="Image de fond (Desktop / Hero)"
                value={section.content?.backgroundImage || ''}
                onChange={(url) => updateContent('backgroundImage', url)}
              />
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Opacité du filtre sombre ({section.content?.overlayOpacity ?? 40}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={section.content?.overlayOpacity ?? 40}
                  onChange={(e) => updateContent('overlayOpacity', Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. TRUST BADGES EDITOR */}
      {section.type === 'TRUST_BADGES' && (
        <div className="space-y-4">
          <p className="text-xs text-stone-500">
            Personnalisez les 4 piliers de réassurance affichés en haut de la boutique (style Shopify Sense).
          </p>
          <div className="space-y-4">
            {(section.content?.items || []).map((item: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700">
                    Badge #{idx + 1} ({item.icon || 'Truck'})
                  </span>
                  <select
                    value={item.icon || 'Truck'}
                    onChange={(e) => updateItemInList(idx, 'icon', e.target.value)}
                    className="text-xs border border-stone-300 rounded-lg px-2 py-1 bg-white"
                  >
                    <option value="Truck">Truck (Livraison)</option>
                    <option value="ShieldCheck">ShieldCheck (Sécurité / COD)</option>
                    <option value="Leaf">Leaf (100% Naturel)</option>
                    <option value="Award">Award (Certifié / Terroir)</option>
                    <option value="Star">Star (Qualité)</option>
                    <option value="Clock">Clock (Rapidité)</option>
                  </select>
                </div>
                {tab === 'fr' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Titre FR"
                      value={item.title_fr || ''}
                      onChange={(e) => updateItemInList(idx, 'title_fr', e.target.value)}
                      className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Sous-titre FR"
                      value={item.subtitle_fr || ''}
                      onChange={(e) => updateItemInList(idx, 'subtitle_fr', e.target.value)}
                      className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                    />
                  </div>
                )}
                {tab === 'ar' && (
                  <div dir="rtl" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="العنوان بالعربية"
                      value={item.title_ar || ''}
                      onChange={(e) => updateItemInList(idx, 'title_ar', e.target.value)}
                      className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white text-right"
                    />
                    <input
                      type="text"
                      placeholder="الوصف الفرعي بالعربية"
                      value={item.subtitle_ar || ''}
                      onChange={(e) => updateItemInList(idx, 'subtitle_ar', e.target.value)}
                      className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white text-right"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FEATURED COLLECTION EDITOR */}
      {section.type === 'FEATURED_COLLECTION' && (
        <div className="space-y-4">
          {tab === 'fr' && (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Titre de la Collection (Français)
                </label>
                <input
                  type="text"
                  value={section.content?.title_fr || ''}
                  onChange={(e) => updateContent('title_fr', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Sous-titre (Français)
                </label>
                <input
                  type="text"
                  value={section.content?.subtitle_fr || ''}
                  onChange={(e) => updateContent('subtitle_fr', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {tab === 'ar' && (
            <div dir="rtl" className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1 text-right">
                  عنوان المجموعة (بالعربية)
                </label>
                <input
                  type="text"
                  value={section.content?.title_ar || ''}
                  onChange={(e) => updateContent('title_ar', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1 text-right">
                  الوصف التوضيحي (بالعربية)
                </label>
                <input
                  type="text"
                  value={section.content?.subtitle_ar || ''}
                  onChange={(e) => updateContent('subtitle_ar', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-right"
                />
              </div>
            </div>
          )}

          {tab === 'media' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Nombre de produits affichés
                </label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={section.content?.limit ?? 4}
                  onChange={(e) => updateContent('limit', Number(e.target.value))}
                  className="w-32 px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Lien « Voir tout »
                </label>
                <input
                  type="text"
                  value={section.content?.viewAllLink || '/catalogue'}
                  onChange={(e) => updateContent('viewAllLink', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. IMAGE BANNER EDITOR */}
      {section.type === 'IMAGE_BANNER' && (
        <div className="space-y-4">
          {tab === 'fr' && (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Titre de la Bannière (Français)
                </label>
                <input
                  type="text"
                  value={section.content?.title_fr || ''}
                  onChange={(e) => updateContent('title_fr', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Texte descriptif (Français)
                </label>
                <textarea
                  rows={3}
                  value={section.content?.description_fr || ''}
                  onChange={(e) => updateContent('description_fr', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Texte du Bouton (Français)
                </label>
                <input
                  type="text"
                  value={section.content?.buttonText_fr || ''}
                  onChange={(e) => updateContent('buttonText_fr', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {tab === 'ar' && (
            <div dir="rtl" className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1 text-right">
                  عنوان البانر (بالعربية)
                </label>
                <input
                  type="text"
                  value={section.content?.title_ar || ''}
                  onChange={(e) => updateContent('title_ar', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1 text-right">
                  الوصف التوضيحي (بالعربية)
                </label>
                <textarea
                  rows={3}
                  value={section.content?.description_ar || ''}
                  onChange={(e) => updateContent('description_ar', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1 text-right">
                  نص الزر (بالعربية)
                </label>
                <input
                  type="text"
                  value={section.content?.buttonText_ar || ''}
                  onChange={(e) => updateContent('buttonText_ar', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-right"
                />
              </div>
            </div>
          )}

          {tab === 'media' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Lien de redirection
                </label>
                <input
                  type="text"
                  value={section.content?.buttonLink || '/a-propos'}
                  onChange={(e) => updateContent('buttonLink', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <ImageUploader
                label="Image de fond"
                value={section.content?.image || ''}
                onChange={(url) => updateContent('image', url)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
