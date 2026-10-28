'use client';

import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Loader2, Check } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors du téléversement');
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || 'Impossible de téléverser le fichier');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setShowUrlInput(false);
      setCustomUrl('');
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
          {label}
        </label>
      )}

      {error && (
        <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
          {error}
        </div>
      )}

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group max-w-md aspect-video flex items-center justify-center">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-stone-900 rounded-lg text-xs font-bold hover:bg-stone-100 transition"
            >
              Changer
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
              aria-label="Supprimer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-xl p-6 text-center cursor-pointer transition bg-stone-50/50 hover:bg-amber-50/20 max-w-md"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-2">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              <span className="text-xs text-stone-500">Téléversement en cours...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-800">
                  Cliquez pour téléverser une photo
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  PNG, JPG ou WebP (max 8 Mo)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Manual URL toggle */}
      <div className="pt-1">
        {showUrlInput ? (
          <div className="flex items-center gap-2 max-w-md">
            <input
              type="url"
              placeholder="https://..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
            >
              Appliquer
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="p-1.5 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="text-[11px] text-amber-700 hover:underline font-semibold"
          >
            ou saisir directement une URL d'image externe
          </button>
        )}
      </div>
    </div>
  );
}
