'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/lib/utils/translations';
import { Lock, Mail, AlertCircle } from 'lucide-react';

interface ModeratorLoginPageProps {
  params: Promise<{ locale: string }>;
}

export default function ModeratorLoginPage({ params }: ModeratorLoginPageProps) {
  const [locale, setLocale] = useState<Locale>('fr');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        userType: 'admin',
        redirect: false,
      });

      if (result?.error) {
        console.error('Auth error:', result.error);
        setError(locale === 'fr' ? 'Identifiants invalides' : 'بيانات الدخول غير صحيحة');
      } else {
        // Check if user is moderator or admin
        if (result?.ok) {
          router.push('/moderateur');
          router.refresh();
        } else {
          setError(locale === 'fr' ? 'Identifiants invalides' : 'بيانات الدخول غير صحيحة');
        }
      }
    } catch (err) {
      setError(locale === 'fr' ? 'Une erreur est survenue' : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {locale === 'fr' ? 'Espace Modérateur' : 'مساحة المشرف'}
            </h1>
            <p className="text-gray-600 mt-2">
              {locale === 'fr'
                ? 'Connectez-vous pour gérer le contenu'
                : 'سجل الدخول لإدارة المحتوى'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'fr' ? 'Email' : 'البريد الإلكتروني'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder={locale === 'fr' ? 'moderator@miel.ma' : 'moderator@miel.ma'}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'fr' ? 'Mot de passe' : 'كلمة المرور'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? locale === 'fr'
                  ? 'Connexion...'
                  : 'جاري الاتصال...'
                : locale === 'fr'
                  ? 'Se connecter'
                  : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/admin/connexion"
              className="text-sm text-amber-600 hover:text-amber-700"
            >
              {locale === 'fr'
                ? '← Retour à l\'administration'
                : '← العودة للإدارة'}
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            {locale === 'fr'
              ? 'Compte par défaut: moderator@miel.ma / moderator123'
              : 'الحساب الافتراضي: moderator@miel.ma / moderator123'}
          </p>
        </div>
      </div>
    </div>
  );
}
