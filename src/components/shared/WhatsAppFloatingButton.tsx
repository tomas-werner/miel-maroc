'use client';

import { useState } from 'react';
import { Locale } from '@/lib/utils/translations';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  locale: Locale;
  phone?: string;
}

export default function WhatsAppFloatingButton({
  locale,
  phone = '212600000000', // Standard Moroccan phone format
}: WhatsAppFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isRTL = locale === 'ar';

  const defaultMessage =
    locale === 'fr'
      ? encodeURIComponent('Bonjour ! Je souhaite avoir des informations ou commander sur votre boutique Miel.')
      : encodeURIComponent('السلام عليكم! أود الاستفسار أو تأكيد طلب من متجر عسل.');

  const whatsappUrl = `https://wa.me/${phone}?text=${defaultMessage}`;

  return (
    <div
      className={`fixed bottom-20 md:bottom-8 z-40 flex flex-col items-end ${
        isRTL ? 'left-4 md:left-8' : 'right-4 md:right-8'
      }`}
    >
      {/* Tooltip / Speech bubble */}
      {isOpen && (
        <div className="mb-3 p-4 bg-white rounded-2xl shadow-2xl border border-emerald-100 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-semibold text-emerald-800">
                {locale === 'fr' ? 'Conseiller en ligne 🇲🇦' : 'مستشار متاح الآن 🇲🇦'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-700 leading-snug mb-3">
            {locale === 'fr'
              ? 'Une question sur nos miels, la livraison ou le paiement à la livraison ? Écrivez-nous sur WhatsApp !'
              : 'هل لديك استفسار حول جودة العسل، التوصيل أو الدفع عند الاستلام؟ تواصل معنا مباشرة عبر واتساب!'}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-3 rounded-xl text-sm transition shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            {locale === 'fr' ? 'Démarrer la discussion' : 'مراسلة عبر واتساب'}
          </a>
        </div>
      )}

      {/* Main Trigger Button */}
      <div className="relative group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="WhatsApp Support"
          className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-emerald-500/40 flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 relative"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400" />
          </span>
          <MessageCircle className="w-7 h-7 fill-white" />
        </button>

        {!isOpen && (
          <div
            className={`hidden md:block absolute top-1/2 -translate-y-1/2 whitespace-nowrap bg-stone-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none transition opacity-0 group-hover:opacity-100 ${
              isRTL ? 'right-full mr-3' : 'left-full ml-3'
            }`}
          >
            {locale === 'fr' ? 'Commander sur WhatsApp' : 'الطلب عبر واتساب'}
          </div>
        )}
      </div>
    </div>
  );
}
