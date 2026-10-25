'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/utils/translations';
import { useCart } from '@/lib/store/cart';
import {
  Flame,
  Clock,
  Sparkles,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Eye,
  MessageCircle,
  Percent,
  Check,
  ChevronRight,
  Gift,
  HelpCircle,
} from 'lucide-react';

interface HomeInteractiveViewProps {
  locale: Locale;
}

interface ProductItem {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviewsCount: number;
  badgeFr?: string;
  badgeAr?: string;
  badgeColor?: string;
  stockLeft: number;
  soldPercentage: number;
  originFr: string;
  originAr: string;
  descriptionFr: string;
  descriptionAr: string;
  variants: { label: string; price: number }[];
}

export default function HomeInteractiveView({ locale }: HomeInteractiveViewProps) {
  const isRTL = locale === 'ar';
  const { addItem } = useCart();

  // Flash Sale Countdown Timer (Hours, Minutes, Seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Active Category Tab for Catalogue Showcase
  const [activeTab, setActiveTab] = useState<string>('all');

  // Quick View Modal Product
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);

  // Toast / notification feedback on adding to cart
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  // Selected FAQ item
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Curated Moroccan Terroir & General E-commerce Products
  const products: ProductItem[] = [
    {
      id: 'daghmous-500g',
      slug: 'miel-daghmous-pur',
      nameFr: "Miel d'Euphorbe Sauvage (Daghmous)",
      nameAr: 'عسل الدغموس الجبلي الحر',
      category: 'miel',
      price: 180,
      originalPrice: 250,
      image:
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 168,
      badgeFr: 'Vente Flash -28%',
      badgeAr: 'عرض حصري -28%',
      badgeColor: 'bg-rose-600',
      stockLeft: 4,
      soldPercentage: 86,
      originFr: 'Région de Souss-Massa & Anti-Atlas',
      originAr: 'منطقة سوس ماسة والأطلس الصغير',
      descriptionFr:
        "Le miel de Daghmous est célèbre pour sa saveur épicée caractéristique et son action apaisante sur la gorge et l'immunité.",
      descriptionAr:
        'عسل الدغموس المغربي الأصيل بمذاقه الحار الطبيعي وفوائده العظيمة لتقوية المناعة ومقاومة نزلات البرد.',
      variants: [
        { label: '250g', price: 95 },
        { label: '500g', price: 180 },
        { label: '1kg', price: 340 },
      ],
    },
    {
      id: 'argan-bio-100ml',
      slug: 'huile-argan-pure-bio',
      nameFr: "Huile d'Argan Pure Certifiée Bio",
      nameAr: 'زيت أركان بيو أصلي 100%',
      category: 'argan',
      price: 140,
      originalPrice: 200,
      image:
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewsCount: 214,
      badgeFr: 'Bestseller ⭐',
      badgeAr: 'الأكثر طلباً ⭐',
      badgeColor: 'bg-amber-600',
      stockLeft: 7,
      soldPercentage: 74,
      originFr: 'Coopérative Féminine d’Essaouira',
      originAr: 'تعاونية نسوية بالصويرة',
      descriptionFr:
        "Extraite par première pression à froid, idéale pour nourrir intensément la peau, les cheveux et les ongles.",
      descriptionAr:
        'معصورة على البارد بطريقة تقليدية ونقية تماماً للعناية الفائقة بالبشرة والشعر ومقاومة التجاعيد.',
      variants: [
        { label: '60ml', price: 85 },
        { label: '100ml', price: 140 },
        { label: '250ml', price: 290 },
      ],
    },
    {
      id: 'amlou-amande-500g',
      slug: 'amlou-traditionnel-amandes-argan',
      nameFr: "Amlou Traditionnel aux Amandes Beldi & Argan",
      nameAr: 'أملو بلدي تقليدي باللوز وزيت أركان',
      category: 'amlou',
      price: 130,
      originalPrice: 175,
      image:
        'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 189,
      badgeFr: 'Recette Royale',
      badgeAr: 'وصفة أصلية',
      badgeColor: 'bg-emerald-700',
      stockLeft: 3,
      soldPercentage: 91,
      originFr: 'Taroudant (Souss)',
      originAr: 'تارودانت',
      descriptionFr:
        "Pâte à tartiner marocaine d’exception : amandes grillées au feu doux, huile d’argan pure et miel d’oranger.",
      descriptionAr:
        'أشهى خلطة مغربية من اللوز البلدي المحمص، زيت الأركان النقي وعسل الليمون الطبيعي لوجبة فطور صحية ومغذية.',
      variants: [
        { label: '250g', price: 70 },
        { label: '500g', price: 130 },
        { label: '1kg', price: 240 },
      ],
    },
    {
      id: 'safran-taliouine-5g',
      slug: 'safran-pur-taliouine',
      nameFr: "Safran Pur de Taliouine (Or Rouge)",
      nameAr: 'زعفران تاليوين الخالص (الذهب الأحمر)',
      category: 'safran',
      price: 160,
      originalPrice: 220,
      image:
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewsCount: 95,
      badgeFr: 'Qualité Supérieure AOP',
      badgeAr: 'جودة ممتازة موثقة',
      badgeColor: 'bg-purple-700',
      stockLeft: 8,
      soldPercentage: 62,
      originFr: 'Taliouine, Anti-Atlas',
      originAr: 'تاليوين، الأطلس الصغير',
      descriptionFr:
        "Fils de safran séchés naturellement à l’ombre, arôme intense et pouvoir colorant exceptionnel.",
      descriptionAr:
        'خيوط الزعفران المغربي الأصيل مجففة بعناية طبيعية، تتميز برائحة زكية وقوة نكهة فريدة لأطباقكم والشاي المغربي.',
      variants: [
        { label: '2g', price: 75 },
        { label: '5g', price: 160 },
        { label: '10g', price: 295 },
      ],
    },
    {
      id: 'miel-thym-500g',
      slug: 'miel-thym-sauvage',
      nameFr: "Miel de Thym Sauvage de Montagne (Zaatar)",
      nameAr: 'عسل الزعتر البري الجبلي',
      category: 'miel',
      price: 195,
      originalPrice: 260,
      image:
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewsCount: 142,
      badgeFr: 'Coup de Cœur',
      badgeAr: 'مفضل الزبائن',
      badgeColor: 'bg-amber-700',
      stockLeft: 5,
      soldPercentage: 80,
      originFr: 'Moyen Atlas (Immouzzer & Ifrane)',
      originAr: 'الأطلس المتوسط (إيموزار وإفران)',
      descriptionFr:
        "Arôme floral puissant et boisé, très apprécié des connaisseurs pour ses vertus digestives et revigorantes.",
      descriptionAr:
        'عسل جبلي عطري بنكهة الزعتر الطبيعية المركزة، معروف بفوائده للجهاز الهضمي والصدر.',
      variants: [
        { label: '500g', price: 195 },
        { label: '1kg', price: 360 },
      ],
    },
    {
      id: 'pack-prestige-maroc',
      slug: 'coffret-prestige-terroir-maroc',
      nameFr: "Coffret Cadeau Prestige des 4 Miels du Royaume",
      nameAr: 'صندوق الهدايا الملكي: 4 أنواع من العسل المغربي',
      category: 'packs',
      price: 320,
      originalPrice: 450,
      image:
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewsCount: 78,
      badgeFr: 'Offre Pack 🎁',
      badgeAr: 'باقة مميزة 🎁',
      badgeColor: 'bg-emerald-800',
      stockLeft: 2,
      soldPercentage: 94,
      originFr: 'Sélection des Meilleurs Ruchers du Maroc',
      originAr: 'مختارات من أجود مناحل المملكة',
      descriptionFr:
        "Comprend : Daghmous (250g), Thym (250g), Oranger (250g), Sidr (250g) + Cuillère en bois d’olivier offerte.",
      descriptionAr:
        'يحتوي على: عسل الدغموس (250غ)، عسل الزعتر (250غ)، عسل الليمون (250غ)، عسل السدر (250غ) + ملعقة خشب الزيتون مجاناً.',
      variants: [{ label: 'Coffret 4 pots x 250g', price: 320 }],
    },
  ];

  // Story-style circular categories (SHEIN style)
  const categoryStories = [
    {
      id: 'miel',
      name: locale === 'fr' ? 'Miels Rares' : 'عسل نادر',
      emoji: '🍯',
      image:
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=200&q=80',
      badge: '-30%',
    },
    {
      id: 'argan',
      name: locale === 'fr' ? 'Argan Bio' : 'أركان نقي',
      emoji: '🌿',
      image:
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=200&q=80',
      badge: 'Bio',
    },
    {
      id: 'amlou',
      name: locale === 'fr' ? 'Amlou Beldi' : 'أملو بلدي',
      emoji: '🌰',
      image:
        'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=200&q=80',
      badge: 'Doux',
    },
    {
      id: 'safran',
      name: locale === 'fr' ? 'Safran Pur' : 'زعفران حر',
      emoji: '🌸',
      image:
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80',
      badge: 'Or',
    },
    {
      id: 'packs',
      name: locale === 'fr' ? 'Packs Cadeaux' : 'باقات فاخرة',
      emoji: '🎁',
      image:
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=200&q=80',
      badge: 'Éco',
    },
    {
      id: 'flash',
      name: locale === 'fr' ? 'Ventes Flash' : 'تخفيضات',
      emoji: '⚡',
      image:
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=200&q=80',
      badge: 'Flash',
    },
  ];

  // Filtering products
  const filteredProducts =
    activeTab === 'all'
      ? products
      : products.filter((p) => p.category === activeTab);

  // Quick Add to Cart action
  const handleQuickAdd = (product: ProductItem, variantIdx: number = 0) => {
    const selectedVariant = product.variants[variantIdx] || product.variants[0];
    addItem({
      variantId: `${product.id}-${selectedVariant.label}`,
      productId: product.id,
      productName: locale === 'fr' ? product.nameFr : product.nameAr,
      productSlug: product.slug,
      sku: `${product.slug.toUpperCase()}-${selectedVariant.label}`,
      price: selectedVariant.price,
      quantity: 1,
      image: product.image,
      attributes: { format: selectedVariant.label },
    });

    setAddedItemName(locale === 'fr' ? product.nameFr : product.nameAr);
    setTimeout(() => setAddedItemName(null), 3000);
  };

  // WhatsApp 1-Click Order Link Generator
  const getWhatsAppOrderUrl = (product: ProductItem) => {
    const message =
      locale === 'fr'
        ? encodeURIComponent(
            `Salam ! Je souhaite commander "${product.nameFr}" à ${product.price} MAD. Livraison à domicile avec paiement à la livraison au Maroc.`
          )
        : encodeURIComponent(
            `السلام عليكم ! أرغب في طلب "${product.nameAr}" بسعر ${product.price} درهم مع التوصيل والدفع عند الاستلام بالمغرب.`
          );
    return `https://wa.me/212600000000?text=${message}`;
  };

  const faqItems = [
    {
      qFr: 'Comment se passe la livraison dans les villes du Maroc ?',
      qAr: 'كيف تتم عملية التوصيل داخل المدن المغربية؟',
      aFr: 'Nous livrons dans toutes les villes du Maroc (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir...) sous 24h à 48h via nos transporteurs partenaires (Amana, CTM ou livreurs express). La livraison est offerte à partir de 300 MAD.',
      aAr: 'نقوم بالتوصيل لجميع المدن والقرى المغربية خلال 24 إلى 48 ساعة عبر شركاء التوصيل السريع (أمانة، ساطيام أو شركات التوصيل المعتمدة). التوصيل مجاني للطلبات ابتداءً من 300 درهم.',
    },
    {
      qFr: 'Puis-je payer en espèces à la livraison (Cash on Delivery) ?',
      qAr: 'هل يمكنني الدفع نقداً عند استلام الطلبية؟',
      aFr: 'Absolument ! Le paiement en espèces à la livraison (COD) est notre mode de paiement privilégié. Vous ne payez qu’après avoir reçu et vérifié votre colis auprès du livreur. Le paiement en ligne par carte bancaire marocaine (CMI) est également disponible.',
      aAr: 'نعم بالتأكيد! الدفع عند الاستلام متاح ومفضل، حيث لا تدفع إلا بعد معاينة واستلام طلبيتك من الموزع. كما يتوفر الدفع الإلكتروني الآمن بالبطاقة البنكية المغربية عبر منصة CMI.',
    },
    {
      qFr: 'Garantissez-vous l’authenticité et la pureté de vos miels ?',
      qAr: 'هل تضمنون نقاوة وأصالة العسل؟',
      aFr: 'Oui, à 100%. Nous gérons notre propre stock sans intermédiaire. Nos miels proviennent directement d’apiculteurs locaux certifiés et subissent des analyses de conformité (taux d’humidité, absence de sucres ajoutés). Satisfait ou remboursé sous 7 jours !',
      aAr: 'نعم، 100% مضمون. نحن نسير مخزوننا الخاص بدون وسطاء، ويتم جني العسل مباشرة من مناحل معتمدة مع فحوصات مخبرية دورية لضمان الخلو التام من السكر المضاف والمواد الحافظة.',
    },
  ];

  return (
    <div className="w-full">
      {/* 0. CART SUCCESS FLOATING NOTIFICATION */}
      {addedItemName && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 z-50 bg-stone-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-500/30 animate-in fade-in slide-in-from-top-4 duration-300 max-w-md">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-stone-400">
              {locale === 'fr' ? 'Ajouté à votre panier' : 'تمت الإضافة إلى السلة'}
            </p>
            <p className="text-xs font-bold text-white truncate">{addedItemName}</p>
          </div>
          <Link
            href={`/${locale}/panier`}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 underline flex-shrink-0"
          >
            {locale === 'fr' ? 'Voir le panier →' : 'عرض السلة ←'}
          </Link>
        </div>
      )}

      {/* 1. HERO SECTION (SHEIN/21st.dev Premium Aesthetics) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-amber-50/40 to-transparent pt-6 pb-14 lg:py-16">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Badge / Origin Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-semibold shadow-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
                </span>
                <span>
                  {locale === 'fr'
                    ? '🇲🇦 Boutique Officielle du Terroir Marocain • Stock Propre'
                    : '🇲🇦 المتجر الرسمي للعسل والتراث المغربي • مخزون مضمون'}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-stone-900 tracking-tight leading-[1.15]">
                {locale === 'fr' ? (
                  <>
                    Le Meilleur du <span className="text-amber-600 underline decoration-amber-300 decoration-wavy">Terroir Marocain</span> Livré chez Vous en 24h
                  </>
                ) : (
                  <>
                    أجود أنواع <span className="text-amber-600 underline decoration-amber-300 decoration-wavy">العسل والتراث المغربي</span> تصلكم لباب المنزل
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-stone-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
                {locale === 'fr'
                  ? 'Miels rares sauvages (Daghmous, Thym, Oranger), huile d’argan pure bio et amlou traditionnel. Commandez en toute confiance avec paiement en espèces à la livraison ou par carte sécurisée.'
                  : 'عسل حر طبيعي (الدغموس، الزعتر، السدر)، زيت أركان معتمد وأملو بلدي تقليدي. تسوقوا بأمان مع إمكانية الدفع نقداً عند استلام طلبيتك أو عبر البطاقة البنكية.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href={`/${locale}/catalogue`}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white font-bold text-sm shadow-lg shadow-amber-600/30 hover:shadow-xl hover:shadow-amber-600/40 hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{locale === 'fr' ? 'Découvrir la Collection' : 'تسوق المنتجات الآن'}</span>
                  {isRTL ? (
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                  ) : (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  )}
                </Link>

                <a
                  href="https://wa.me/212600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{locale === 'fr' ? 'Commander sur WhatsApp' : 'الطلب السريع عبر واتساب'}</span>
                </a>
              </div>

              {/* Trust Micro-Metrics */}
              <div className="pt-4 border-t border-stone-200/80 grid grid-cols-3 gap-3 text-start">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-stone-900">100%</p>
                  <p className="text-[11px] sm:text-xs text-stone-500 font-medium">
                    {locale === 'fr' ? 'Pur & Naturel' : 'طبيعي ونقي 100%'}
                  </p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-amber-600">24-48h</p>
                  <p className="text-[11px] sm:text-xs text-stone-500 font-medium">
                    {locale === 'fr' ? 'Livraison Maroc' : 'توصيل سريع بالمغرب'}
                  </p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-emerald-600">COD</p>
                  <p className="text-[11px] sm:text-xs text-stone-500 font-medium">
                    {locale === 'fr' ? 'Paiement à la livraison' : 'الدفع عند الاستلام'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card (Inspiré 21st.dev Glassmorphism) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-amber-200/50 bg-white">
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80"
                    alt="Miel Pur du Maroc"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 bg-amber-600 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-white" />
                      {locale === 'fr' ? 'Offre Vedette du Jour' : 'عرض اليوم المميز'}
                    </span>
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-stone-800 font-bold text-xs rounded-full shadow-md">
                      🇲🇦 Souss-Massa
                    </span>
                  </div>

                  {/* Bottom Card Inside Image */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl glass-dark text-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-300 font-semibold tracking-wide">
                        {locale === 'fr' ? 'Miel de Daghmous Sauvage 500g' : 'عسل الدغموس الحر 500غ'}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>4.9 (168)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-2xl font-black text-white">180 MAD</span>
                        <span className="text-xs text-stone-400 line-through ms-2">250 MAD</span>
                      </div>

                      <button
                        onClick={() => handleQuickAdd(products[0])}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{locale === 'fr' ? 'Ajouter' : 'طلب الآن'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CIRCULAR CATEGORY STORIES (SHEIN / Instagram style) */}
      <section className="py-6 border-y border-stone-200/70 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-stone-400">
              {locale === 'fr' ? 'Explorer par Rayon' : 'تصفح حسب الأقسام'}
            </h2>
            <Link
              href={`/${locale}/catalogue`}
              className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
            >
              <span>{locale === 'fr' ? 'Tout voir' : 'عرض الكل'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
            {categoryStories.map((story) => (
              <button
                key={story.id}
                onClick={() => {
                  if (story.id === 'flash') {
                    const el = document.getElementById('flash-deals');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setActiveTab(story.id);
                    const el = document.getElementById('catalog-showcase');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex flex-col items-center flex-shrink-0 group cursor-pointer"
              >
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-emerald-500 group-hover:scale-105 transition duration-300">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white bg-amber-50">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  {story.badge && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase shadow-xs">
                      {story.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-stone-800 mt-2 group-hover:text-amber-700 transition">
                  {story.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FLASH DEALS SECTION (SHEIN Countdown & Stock Bar) */}
      <section id="flash-deals" className="py-12 bg-amber-500/5">
        <div className="container mx-auto px-4">
          {/* Header with Countdown Timer */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white shadow-xl mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {locale === 'fr' ? 'VENTES FLASH DU JOUR' : 'تخفيضات اليوم الحصرية'}
                  </h2>
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    -40% MAX
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  {locale === 'fr'
                    ? 'Offres limitées dans le temps, jusqu’à épuisement du stock disponible.'
                    : 'عروض محدودة بوقت وكمية المخزون المتوفر لكل منتج.'}
                </p>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider me-1">
                {locale === 'fr' ? 'Fin dans :' : 'ينتهي العرض بعد:'}
              </span>
              <div className="flex items-center gap-1.5 font-mono">
                <div className="bg-stone-800 border border-stone-700 text-amber-400 font-black text-lg px-2.5 py-1 rounded-lg">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="text-amber-400 font-bold">:</span>
                <div className="bg-stone-800 border border-stone-700 text-amber-400 font-black text-lg px-2.5 py-1 rounded-lg">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="text-amber-400 font-bold">:</span>
                <div className="bg-stone-800 border border-stone-700 text-amber-400 font-black text-lg px-2.5 py-1 rounded-lg">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>

          {/* Flash Deals Cards Grid (3 Featured Products) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image with discount badge */}
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={locale === 'fr' ? product.nameFr : product.nameAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {product.badgeFr && (
                      <span
                        className={`absolute top-3 ${
                          isRTL ? 'right-3' : 'left-3'
                        } ${product.badgeColor} text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md`}
                      >
                        {locale === 'fr' ? product.badgeFr : product.badgeAr}
                      </span>
                    )}

                    {/* Quick view button */}
                    <button
                      onClick={() => {
                        setQuickViewProduct(product);
                        setSelectedVariantIdx(0);
                      }}
                      className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-stone-800 p-2 rounded-xl shadow-md transition opacity-0 group-hover:opacity-100"
                      aria-label="Aperçu rapide"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
                      {locale === 'fr' ? product.originFr : product.originAr}
                    </p>

                    <h3 className="font-bold text-stone-900 text-base line-clamp-1 group-hover:text-amber-700 transition">
                      {locale === 'fr' ? product.nameFr : product.nameAr}
                    </h3>

                    {/* Price and Old Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-amber-600">
                        {product.price} MAD
                      </span>
                      <span className="text-xs text-stone-400 line-through">
                        {product.originalPrice} MAD
                      </span>
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </div>

                    {/* Stock Progress Bar (SHEIN style urgency) */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-medium text-stone-500">
                        <span>
                          {locale === 'fr'
                            ? `Déjà vendu à ${product.soldPercentage}%`
                            : `تم بيع ${product.soldPercentage}%`}
                        </span>
                        <span className="text-rose-600 font-bold">
                          {locale === 'fr'
                            ? `Plus que ${product.stockLeft} pièces !`
                            : `بقي ${product.stockLeft} فقط!`}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                          style={{ width: `${product.soldPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? 'Ajouter' : 'أضف للسلة'}</span>
                  </button>

                  <a
                    href={getWhatsAppOrderUrl(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                    <span>{locale === 'fr' ? 'WhatsApp' : 'واتساب'}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MAIN CATALOGUE DISCOVERY & TABS (Alibaba Inspiration) */}
      <section id="catalog-showcase" className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Catalogue Sélectionné' : 'مختارات الكتالوج'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {locale === 'fr'
                  ? 'Nos Trésors Naturels & Packs Découverte'
                  : 'منتجاتنا الطبيعية وباقات الاكتشاف'}
              </h2>
            </div>

            {/* Filter Tabs (Alibaba/SHEIN style) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'all', labelFr: 'Tous les Trésors', labelAr: 'الكل' },
                { id: 'miel', labelFr: 'Miels Rares', labelAr: 'أنواع العسل' },
                { id: 'argan', labelFr: 'Argan & Soins', labelAr: 'الأركان' },
                { id: 'amlou', labelFr: 'Amlou', labelAr: 'أملو' },
                { id: 'safran', labelFr: 'Safran & Épices', labelAr: 'الزعفران' },
                { id: 'packs', labelFr: 'Coffrets Cadeaux', labelAr: 'الباقات' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-stone-900 text-white shadow-md'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {locale === 'fr' ? tab.labelFr : tab.labelAr}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={locale === 'fr' ? product.nameFr : product.nameAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      {product.badgeFr ? (
                        <span
                          className={`${product.badgeColor} text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs`}
                        >
                          {locale === 'fr' ? product.badgeFr : product.badgeAr}
                        </span>
                      ) : <span />}

                      <span className="bg-white/90 backdrop-blur-md text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        {locale === 'fr' ? 'Stock Propre' : 'مخزون مضمون'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setQuickViewProduct(product);
                        setSelectedVariantIdx(0);
                      }}
                      className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-stone-800 p-2 rounded-xl shadow-md transition opacity-0 group-hover:opacity-100"
                      aria-label="Aperçu rapide"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-2.5">
                    {/* Star Rating */}
                    <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-stone-400 font-medium">
                        ({product.reviewsCount} {locale === 'fr' ? 'avis' : 'تقييم'})
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-base group-hover:text-amber-700 transition">
                      {locale === 'fr' ? product.nameFr : product.nameAr}
                    </h3>

                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {locale === 'fr' ? product.descriptionFr : product.descriptionAr}
                    </p>

                    {/* Price and Variants */}
                    <div className="flex items-baseline justify-between pt-2 border-t border-stone-100">
                      <div>
                        <span className="text-xl font-black text-amber-600">
                          {product.price} MAD
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-stone-400 line-through ms-2">
                            {product.originalPrice} MAD
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {locale === 'fr' ? 'En stock' : 'متوفر'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? 'Ajouter' : 'أضف للسلة'}</span>
                  </button>

                  <a
                    href={getWhatsAppOrderUrl(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{locale === 'fr' ? 'Commander' : 'طلب سريع'}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US (Morocco Specific Trust & Operation) */}
      <section className="py-16 bg-stone-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800">
              {locale === 'fr' ? 'Nos Engagements au Maroc' : 'التزاماتنا لخدمتكم بالمغرب'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {locale === 'fr'
                ? 'Pourquoi Nous Faire Confiance ?'
                : 'لماذا يفضل زبناؤنا التسوق معنا؟'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              {locale === 'fr'
                ? 'Contrairement aux marketplaces sans stock vérifié, nous sélectionnons et stockons nous-mêmes chacun de nos produits.'
                : 'على عكس المنصات التجارية التي تفتقر للمخزون الفعلي، نحن نتحكم في مخزوننا الخاص ونتحقق من جودة كل منتج.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">
                {locale === 'fr' ? 'Livraison 24h/48h' : 'توصيل خلال 24-48 ساعة'}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {locale === 'fr'
                  ? 'Expédition rapide vers toutes les villes du Royaume avec suivi par SMS et WhatsApp.'
                  : 'شحن سريع لكافة المدن المغربية مع تتبع مباشر ومستمر لطلبيتكم.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">
                {locale === 'fr' ? 'Paiement à Réception' : 'الدفع عند الاستلام'}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {locale === 'fr'
                  ? 'Commandez sans stress : payez en espèces uniquement lors de la remise de votre commande.'
                  : 'تسوقوا براحة بال تامة : لا تدفعوا نقداً إلا بعد تسلم ومعاينة الطلبية.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">
                {locale === 'fr' ? 'Stock 100% Propre' : 'مخزون خاص وأصيل'}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {locale === 'fr'
                  ? 'Pas d’intermédiaires obscurs. Chaque pot est pesé, scellé et conservé dans nos entrepôts.'
                  : 'بدون وسيط مجهول. كل علبة عسل مفحوصة ومخزنة في ظروف صحية ملائمة.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">
                {locale === 'fr' ? 'Équipe Dédiée au Maroc' : 'فريق مغربي لخدمتكم'}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {locale === 'fr'
                  ? 'Une assistance chaleureuse en Darija et en Français joignable 7 jours sur 7 sur WhatsApp.'
                  : 'مساعدة واستقبال دافئ بالدارجة المغربية والفرنسية على مدار الأسبوع.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION (Moroccan E-commerce Specifics) */}
      <section className="py-14 bg-stone-50/70 border-b border-stone-200">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              {locale === 'fr'
                ? 'Questions Fréquentes sur la Commande au Maroc'
                : 'الأسئلة الأكثر تداولاً حول الطلب والتوصيل'}
            </h2>
            <p className="text-xs text-stone-500">
              {locale === 'fr'
                ? 'Tout ce que vous devez savoir avant de passer votre commande'
                : 'كل ما تحتاجون لمعرفته قبل تأكيد طلبيتكم'}
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-start font-bold text-sm text-stone-800 flex items-center justify-between gap-4"
                >
                  <span>{locale === 'fr' ? item.qFr : item.qAr}</span>
                  <span className="text-amber-600 text-lg flex-shrink-0">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-0 text-xs text-stone-600 leading-relaxed border-t border-stone-100 mt-2 pt-3">
                    {locale === 'fr' ? item.aFr : item.aAr}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. QUICK VIEW MODAL (21st.dev Component) */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative p-6">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 p-2 rounded-full transition"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src={quickViewProduct.image}
                  alt={locale === 'fr' ? quickViewProduct.nameFr : quickViewProduct.nameAr}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
                    {locale === 'fr' ? quickViewProduct.originFr : quickViewProduct.originAr}
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 mt-1">
                    {locale === 'fr' ? quickViewProduct.nameFr : quickViewProduct.nameAr}
                  </h3>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-black text-amber-600">
                      {quickViewProduct.variants[selectedVariantIdx]?.price || quickViewProduct.price} MAD
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                      {quickViewProduct.originalPrice} MAD
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                    {locale === 'fr' ? quickViewProduct.descriptionFr : quickViewProduct.descriptionAr}
                  </p>

                  {/* Format Selector */}
                  <div className="mt-4 space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      {locale === 'fr' ? 'Format & Poids :' : 'الحجم والوزن:'}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {quickViewProduct.variants.map((variant, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedVariantIdx(idx)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                            selectedVariantIdx === idx
                              ? 'border-amber-600 bg-amber-50 text-amber-900'
                              : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          {variant.label} ({variant.price} MAD)
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      handleQuickAdd(quickViewProduct, selectedVariantIdx);
                      setQuickViewProduct(null);
                    }}
                    className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{locale === 'fr' ? 'Ajouter au panier' : 'أضف إلى السلة'}</span>
                  </button>

                  <a
                    href={getWhatsAppOrderUrl(quickViewProduct)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>{locale === 'fr' ? 'Commander directement sur WhatsApp' : 'طلب مباشر عبر واتساب'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
