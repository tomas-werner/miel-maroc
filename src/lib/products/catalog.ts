import { ProductDetailData } from '@/components/products/ProductDetailClient';

export const TERROIR_PRODUCTS: Record<string, ProductDetailData> = {
  'miel-daghmous-pur': {
    id: 'prod-daghmous-1',
    slug: 'miel-daghmous-pur',
    nameFr: "Miel d'Euphorbe Sauvage Pur (Daghmous)",
    nameAr: 'عسل الدغموس الجبلي الحر النقي',
    categoryNameFr: 'Miels Rares & Terroir',
    categoryNameAr: 'أنواع العسل النادرة',
    categorySlug: 'miel',
    basePrice: 180,
    originalPrice: 250,
    rating: 4.9,
    reviewsCount: 168,
    originFr: 'Région de Souss-Massa & Anti-Atlas',
    originAr: 'منطقة سوس ماسة والأطلس الصغير',
    harvestFr: 'Récolte d’été 2026',
    harvestAr: 'جني صيف 2026',
    shortDescFr:
      'Le miel de Daghmous (euphorbe résinifère) est le trésor le plus réputé de l’apiculture marocaine. Récolté sur les plateaux sauvages de l’Anti-Atlas, il offre une chaleur piquante inimitable en fond de gorge.',
    shortDescAr:
      'عسل الدغموس المغربي الأصيل، المستخرج من نبات الدغموس الطبيعي بجبال الأطلس الصغير. يتميز بمذاقه الحار واللاذع الطبيعي المشهور بفوائده للجسم.',
    longDescFr:
      'Ce miel monofloral d’euphorbe sauvage est récolté de manière artisanale par nos apiculteurs partenaires dans le respect le plus strict des colonies d’abeilles. Sa texture onctueuse et sa couleur dorée ambrée s’accompagnent d’une sensation de chaleur intense en gorge, très recherchée traditionnellement pour fortifier l’organisme, calmer les maux de gorge et stimuler le système immunitaire.',
    longDescAr:
      'عسل الدغموس الطبيعي 100% بدون أي إضافات، مجني يدوياً من مناحل جبلية نقية. يُعد هذا العسل من أشهر وأثمن أنواع العسل بالمغرب لفوائده العلاجية والوقائية وخاصة في فترات البرد والإنفلونزا.',
    benefitsFr: [
      'Renforce le système immunitaire et la vitalité',
      'Action chauffante et apaisante pour la gorge et les voies respiratoires',
      'Antibactérien et antiseptique naturel puissant',
      'Aide digestive et tonifiant naturel le matin',
    ],
    benefitsAr: [
      'تقوية المناعة الطبيعية ومقاومة الأمراض',
      'تهدئة الحلق ومشاكل الجهاز التنفسي والبرد',
      'مضاد حيوي ومطهر طبيعي قوي للجسم',
      'منشط طبيعي يمنح طاقة وحيوية طوال اليوم',
    ],
    usageAdviceFr:
      'Prendre une cuillère à jeun le matin avec un demi-verre d’eau tiède, ou dans une infusion de thym. Ne jamais chauffer au-dessus de 40°C pour préserver toutes ses enzymes actives.',
    usageAdviceAr:
      'تناول ملعقة على الريق صباحاً مع نصف كأس ماء فاتر أو مع شاي الأعشاب. تجنب غلي العسل للحفاظ على كامل الإنزيمات والفيتامينات.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80',
        altFr: "Pot de Miel d'Euphorbe Daghmous 500g",
        altAr: 'علبة عسل الدغموس الحر 500غ',
      },
      {
        url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80',
        altFr: 'Miel pur et cuillère en bois',
        altAr: 'عسل نقي مع ملعقة خشبية',
      },
      {
        url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
        altFr: 'Coffret terroir marocain',
        altAr: 'صندوق الهدايا المغربي',
      },
    ],
    variants: [
      {
        id: 'var-daghmous-250',
        sku: 'DAGH-250G',
        labelFr: 'Pot de 250g',
        labelAr: 'علبة 250غ',
        price: 95,
        stock: 12,
      },
      {
        id: 'var-daghmous-500',
        sku: 'DAGH-500G',
        labelFr: 'Pot de 500g (Format Conseillé)',
        labelAr: 'علبة 500غ (الأكثر طلباً)',
        price: 180,
        stock: 4,
      },
      {
        id: 'var-daghmous-1000',
        sku: 'DAGH-1KG',
        labelFr: 'Pot Familial 1kg',
        labelAr: 'علبة عائلية 1 كغ',
        price: 340,
        stock: 8,
      },
    ],
  },

  'huile-argan-pure-bio': {
    id: 'prod-argan-1',
    slug: 'huile-argan-pure-bio',
    nameFr: "Huile d'Argan Pure 100% Bio Certifiée",
    nameAr: 'زيت أركان بيو أصلي معتمد 100%',
    categoryNameFr: 'Huile d’Argan & Soins',
    categoryNameAr: 'زيت أركان والعناية',
    categorySlug: 'argan',
    basePrice: 140,
    originalPrice: 200,
    rating: 5.0,
    reviewsCount: 214,
    originFr: 'Coopérative Féminine Artisanale d’Essaouira',
    originAr: 'تعاونية نسوية حرفية بالصويرة',
    harvestFr: 'Pressage à froid 2026',
    harvestAr: 'عصر على البارد 2026',
    shortDescFr:
      'Huile d’argan cosmétique vierge extra, extraite par première pression à froid d’amandons non torréfiés. Un soin anti-âge et régénérant universel pour le visage, le corps et la chevelure.',
    shortDescAr:
      'زيت أركان التجميلي البكر الممتاز، معصور على البارد من لوز الأركان الطازج بدون تحميص، لترطيب وتغذية فائقة للبشرة والشعر ومقاومة التجاعيد.',
    longDescFr:
      'Riche en vitamine E naturelle, en acides gras insaturés (oméga 6 et 9) et en stérols, notre huile d’argan pure certifiée est absorbée immédiatement sans laisser de film gras. Elle restaure le film hydrolipidique de la peau, renforce la brillance des cheveux secs ou cassants et fortifie les ongles dédoublés.',
    longDescAr:
      'غني بفيتامين E ومضادات الأكسدة الطبيعية، يمتصه الجلد بسرعة فائقة ليمنح نضارة وإشراقة طبيعية فورية. يغذي أطراف الشعر المتقصفة ويحمي البشرة من الجفاف وعوامل الطقس.',
    benefitsFr: [
      'Puissant sérum anti-âge et régénérant cutané',
      'Hydratation en profondeur sans effet gras',
      'Réparation des pointes de cheveux abîmées et sèches',
      'Renforcement des ongles cassants et fragiles',
    ],
    benefitsAr: [
      'مقاوم طبيعي لعلامات تقدم سن البشرة والتجاعيد',
      'ترطيب عميق وسريع بدون ترك أثر دهني',
      'علاج تقصف وبهتان الشعر ومنحه لمعاناً صحياً',
      'تقوية وتغذية الأظافر الهشة',
    ],
    usageAdviceFr:
      'Appliquer quelques gouttes le soir sur peau propre en mouvements circulaires. En bain d’huile capillaire : laisser poser 30 minutes avant le shampoing.',
    usageAdviceAr:
      'ضعي قطرات قليلة على الوجه ليلاً بعد تنظيفه ودلكي بلطف. للشعر: يوضع كحمام زيت لمدة 30 دقيقة قبل الغسل.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80',
        altFr: "Flacon en verre d'huile d'argan bio",
        altAr: 'قارورة زجاجية لزيت أركان الطبيعي',
      },
    ],
    variants: [
      {
        id: 'var-argan-60',
        sku: 'ARG-60ML',
        labelFr: 'Flacon Pipette 60ml',
        labelAr: 'قارورة قطارة 60 مل',
        price: 85,
        stock: 15,
      },
      {
        id: 'var-argan-100',
        sku: 'ARG-100ML',
        labelFr: 'Flacon Pipette 100ml',
        labelAr: 'قارورة قطارة 100 مل',
        price: 140,
        stock: 7,
      },
      {
        id: 'var-argan-250',
        sku: 'ARG-250ML',
        labelFr: 'Flacon Pompe 250ml',
        labelAr: 'قارورة بمضخة 250 مل',
        price: 290,
        stock: 5,
      },
    ],
  },

  'amlou-traditionnel-amandes-argan': {
    id: 'prod-amlou-1',
    slug: 'amlou-traditionnel-amandes-argan',
    nameFr: "Amlou Artisanal aux Amandes Beldi & Argan",
    nameAr: 'أملو بلدي أصيل باللوز وزيت أركان',
    categoryNameFr: 'Amlou Artisanal',
    categoryNameAr: 'أملو تقليدي',
    categorySlug: 'amlou',
    basePrice: 130,
    originalPrice: 175,
    rating: 4.9,
    reviewsCount: 189,
    originFr: 'Région de Taroudant (Souss)',
    originAr: 'تارودانت، سوس',
    harvestFr: 'Préparation hebdomadaire fraîche',
    harvestAr: 'تحضير أسبوعي طازج',
    shortDescFr:
      'La pâte à tartiner berbère par excellence : amandes beldi torréfiées sur meule de pierre, huile d’argan pure alimentaire et une touche de miel d’oranger.',
    shortDescAr:
      'الخلطة المغربية الأصيلة من اللوز البلدي المحمص، زيت الأركان الصافي وعسل زهر الليمون الطبيعي لوجبة فطور صحية وشهية.',
    longDescFr:
      'Préparé selon la recette ancestrale du Souss, notre Amlou ne contient ni huile de palme, ni sucre raffiné, ni conservateur. Les amandes beldi sont broyées lentement sur meule de pierre traditionnelle afin de libérer leurs arômes toastés, avant d’être émulsionnées avec notre huile d’argan culinaire dorée et un filet de miel d’oranger.',
    longDescAr:
      'محضر وفق التقاليد العريقة بدون زيت النخيل أو سكر صناعي. مزيج صحي متكامل يجمع طاقة اللوز، فوائد الأركان ونقاء العسل، مثالي للكبار والصغار.',
    benefitsFr: [
      'Excellente source d’énergie naturelle saine',
      'Riche en protéines végétales et acides gras essentiels',
      'Sans sucre raffiné, sans additif ni conservateur',
      'Idéal au petit-déjeuner sur du pain chaud ou msemen',
    ],
    benefitsAr: [
      'مصدر ممتاز للطاقة والحيوية الطبيعية',
      'غني بالبروتين النباتي والدهون الصحية غير المشبعة',
      'خال تماماً من السكر الأبيض والمواد الحافظة',
      'مثالي لوجبة فطور مغذية مع الخبز الساخن والمسمن',
    ],
    usageAdviceFr:
      'Bien mélanger avant chaque dégustation avec une cuillère en bois afin d’homogénéiser l’huile d’argan naturelle remontée en surface.',
    usageAdviceAr:
      'يُخلط جيداً بملعقة خشبية قبل الاستهلاك لإعادة مزج زيت الأركان الطبيعي المتجمع على السطح.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1000&q=80',
        altFr: 'Pot d’Amlou marocain traditionnel aux amandes',
        altAr: 'علبة أملو تقليدي باللوز وزيت أركان',
      },
    ],
    variants: [
      {
        id: 'var-amlou-250',
        sku: 'AML-250G',
        labelFr: 'Pot de 250g',
        labelAr: 'علبة 250غ',
        price: 70,
        stock: 20,
      },
      {
        id: 'var-amlou-500',
        sku: 'AML-500G',
        labelFr: 'Pot de 500g',
        labelAr: 'علبة 500غ',
        price: 130,
        stock: 3,
      },
      {
        id: 'var-amlou-1000',
        sku: 'AML-1KG',
        labelFr: 'Pot de 1kg',
        labelAr: 'علبة 1 كغ',
        price: 240,
        stock: 6,
      },
    ],
  },

  'safran-pur-taliouine': {
    id: 'prod-safran-1',
    slug: 'safran-pur-taliouine',
    nameFr: "Safran Pur de Taliouine (Appellation d'Origine)",
    nameAr: 'زعفران تاليوين الأصيل الحر',
    categoryNameFr: 'Safran & Épices',
    categoryNameAr: 'الزعفران والتوابل',
    categorySlug: 'safran',
    basePrice: 160,
    originalPrice: 220,
    rating: 5.0,
    reviewsCount: 95,
    originFr: 'Taliouine, Anti-Atlas (1 500m d’altitude)',
    originAr: 'تاليوين، الأطلس الصغير (ارتفاع 1500م)',
    harvestFr: 'Récolte d’automne 2026',
    harvestAr: 'جني خريف 2026',
    shortDescFr:
      'L’Or Rouge du Maroc par excellence. Stigmates entiers de safran pur de catégorie 1, récoltés fleur par fleur à l’aube et séchés traditionnellement à l’abri du soleil.',
    shortDescAr:
      'الذهب الأحمر المغربي ذو الشهرة العالمية. خيوط الزعفران النقي من الصنف الأول، مجنية يدوياً زهرة بزهرة مع الحفاظ على كامل الزيوت العطرية.',
    longDescFr:
      'Le microclimat d’altitude et la terre aride de Taliouine confèrent à notre safran une concentration remarquable en safranal et en crocine. Ses filaments rouge vermillon vif colorent délicatement vos mets (tajines, riz, pastillas) et apportent une note subtile et chaleureuse à votre thé marocain.',
    longDescAr:
      'زعفران طبيعي 100% يمنح أطباقكم الطاجين، الشاي المغربي، والحلويات نكهة أصيلة ورائحة زكية وقوة تلوين استثنائية مع فوائد مهدئة للأعصاب.',
    benefitsFr: [
      'Puissant antioxydant et régulateur de l’humeur',
      'Propriétés digestives et stimulantes',
      'Sublime les tajines royaux, le riz et le thé marocain',
      'Faible dose nécessaire grâce à sa pureté exceptionnelle',
    ],
    benefitsAr: [
      'مضاد أكسدة قوي ومحسن طبيعي للمزاج',
      'مساعد على الهضم ومريح للجهاز العصبي',
      'يضفي نكهة ملكية على الطاجين والشاي المغربي',
      'تركيز عالي يكفي بضع شعيرات للحصول على المذاق المطلوب',
    ],
    usageAdviceFr:
      'Faire infuser quelques filaments dans 2 cuillères d’eau tiède ou de lait 15 minutes avant de les incorporer en fin de cuisson.',
    usageAdviceAr:
      'انقع بضعة خيوط في قليل من الماء الدافئ لمدة 15 دقيقة قبل إضافتها في نهاية طهي الوجبة أو إبريق الشاي.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
        altFr: 'Fils de safran pur de Taliouine dans une coupelle en cuivre',
        altAr: 'خيوط زعفران تاليوين الأصيل',
      },
    ],
    variants: [
      {
        id: 'var-safran-2',
        sku: 'SAF-2G',
        labelFr: 'Boîte prestige 2g',
        labelAr: 'علبة فاخرة 2غ',
        price: 75,
        stock: 18,
      },
      {
        id: 'var-safran-5',
        sku: 'SAF-5G',
        labelFr: 'Boîte prestige 5g',
        labelAr: 'علبة فاخرة 5غ',
        price: 160,
        stock: 8,
      },
      {
        id: 'var-safran-10',
        sku: 'SAF-10G',
        labelFr: 'Boîte prestige 10g',
        labelAr: 'علبة فاخرة 10غ',
        price: 295,
        stock: 4,
      },
    ],
  },

  'miel-thym-sauvage': {
    id: 'prod-thym-1',
    slug: 'miel-thym-sauvage',
    nameFr: 'Miel de Thym Sauvage de Montagne (Zaatar)',
    nameAr: 'عسل الزعتر البري الجبلي الحر',
    categoryNameFr: 'Miels Rares & Terroir',
    categoryNameAr: 'أنواع العسل النادرة',
    categorySlug: 'miel',
    basePrice: 195,
    originalPrice: 260,
    rating: 4.8,
    reviewsCount: 142,
    originFr: 'Plateaux du Moyen Atlas (Immouzzer & Ifrane)',
    originAr: 'هضاب الأطلس المتوسط (إيموزار وإفران)',
    harvestFr: 'Récolte d’été 2026',
    harvestAr: 'جني صيف 2026',
    shortDescFr:
      'Un grand cru de l’apiculture de montagne. Robe ambrée, goût corsé et persistant aux notes aromatiques de thym sauvage.',
    shortDescAr:
      'عسل جبلي فاخر بلون عنبري ونكهة قوية زكية من أزهار الزعتر البري الطبيعية، مشهور بفوائده للجهاز الهضمي والصدر.',
    longDescFr:
      'Récolté sur les hauteurs du Moyen Atlas où le thym sauvage fleurit en abondance sous le soleil d’été. C’est un miel dense, riche en arômes résineux, réputé pour son pouvoir tonifiant et sa douceur enveloppante.',
    longDescAr:
      'عسل مستخرج من نبات الزعتر البري في قمم جبال الأطلس المتوسط، يمتاز بخصائصه المقوية والمطهرة ومساعدته الفعالة على راحة المعدة.',
    benefitsFr: [
      'Soutien exceptionnel du système respiratoire',
      'Effet antiseptique et cicatrisant naturel',
      'Facilite la digestion après les repas copieux',
      'Arôme puissant très apprécié des amateurs de miels de caractère',
    ],
    benefitsAr: [
      'دعم ممتاز لصحة الجهاز التنفسي',
      'مطهر طبيعي للجهاز الهضمي والمعدة',
      'يساعد على الهضم والتخلص من الانتفاخ',
      'مذاق عطري فريد لعشاق العسل الجبلي المركز',
    ],
    usageAdviceFr:
      'Une cuillère pure au coucher, ou diluée dans un thé à la menthe ou une tisane tiède.',
    usageAdviceAr:
      'ملعقة قبل النوم مباشرة أو مع كأس ماء دافئ أو شاي الأعشاب.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80',
        altFr: 'Pot de miel de thym sauvage marocain',
        altAr: 'علبة عسل الزعتر المغربي',
      },
    ],
    variants: [
      {
        id: 'var-thym-500',
        sku: 'THYM-500G',
        labelFr: 'Pot de 500g',
        labelAr: 'علبة 500غ',
        price: 195,
        stock: 5,
      },
      {
        id: 'var-thym-1000',
        sku: 'THYM-1KG',
        labelFr: 'Pot de 1kg',
        labelAr: 'علبة 1 كغ',
        price: 360,
        stock: 7,
      },
    ],
  },

  'coffret-prestige-terroir-maroc': {
    id: 'prod-pack-1',
    slug: 'coffret-prestige-terroir-maroc',
    nameFr: 'Coffret Cadeau Prestige des 4 Miels du Royaume',
    nameAr: 'صندوق الهدايا الملكي: 4 أنواع من العسل المغربي',
    categoryNameFr: 'Coffrets Cadeaux',
    categoryNameAr: 'صناديق الهدايا',
    categorySlug: 'packs',
    basePrice: 320,
    originalPrice: 450,
    rating: 5.0,
    reviewsCount: 78,
    originFr: 'Sélection des Plus Beaux Terroirs du Maroc',
    originAr: 'مختارات من أجمل مناطق المملكة المغربية',
    harvestFr: 'Cru sélection 2026',
    harvestAr: 'مختارات 2026',
    shortDescFr:
      'Le cadeau idéal : 4 pots de 250g (Daghmous, Thym, Oranger, Sidr) présentés dans un sublime coffret rigide avec cuillère en bois d’olivier offerte.',
    shortDescAr:
      'الهدية المثالية لأحبابكم : 4 علب بوزن 250غ (الدغموس، الزعتر، الليمون، السدر) في صندوق فاخر مع ملعقة خشب الزيتون مجاناً.',
    longDescFr:
      'Un voyage gustatif complet à travers les ruches du Maroc : la force piquante de l’euphorbe du Souss, les notes boisées du thym de l’Atlas, la douceur fruitée des orangers de Berkane et la noblesse du sidr. Présenté dans un écrin magnétique prêt à offrir.',
    longDescAr:
      'رحلة تذوق لا مثيل لها عبر مناحل المغرب : دغموس سوس الحار، زعتر الأطلس العطري، زهر ليمون بركان الحلو وسدر الصحراء النبيل، في صندوق هدية أنيق ومحكم.',
    benefitsFr: [
      'Assortiment complet pour découvrir toute la richesse apicole du Maroc',
      'Idéal comme cadeau pour fêtes, Ramadan, invitations et famille',
      'Cuillère à miel artisanale en bois d’olivier véritable offerte',
      'Économisez 130 MAD par rapport à l’achat individuel',
    ],
    benefitsAr: [
      'تشكيلة شاملة لاكتشاف كل نكهات العسل المغربي الأصيل',
      'هدية راقية ومميزة للمناسبات، شهر رمضان والزيارات العائلية',
      'ملعقة عسل تقليدية من خشب الزيتون الطبيعي مرفقة مجاناً',
      'توفير 130 درهم مقارنة بشراء كل علبة على حدة',
    ],
    usageAdviceFr:
      'À déguster en comparatif pour apprécier les différentes nuances aromatiques de nos terroirs.',
    usageAdviceAr:
      'مثالي للتذوق العائلي ومقارنة نكهات العسل المختلفة.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
        altFr: 'Coffret cadeau de miel marocain',
        altAr: 'صندوق هدايا العسل المغربي',
      },
    ],
    variants: [
      {
        id: 'var-pack-4x250',
        sku: 'PACK-4X250G',
        labelFr: 'Coffret 4 pots x 250g + Cuillère offerte',
        labelAr: 'صندوق 4 علب × 250غ + ملعقة مجانية',
        price: 320,
        stock: 2,
      },
    ],
  },
};

export function getProductBySlug(slug: string): ProductDetailData | null {
  if (TERROIR_PRODUCTS[slug]) {
    return TERROIR_PRODUCTS[slug];
  }

  // Fallback for generic slugs like 'miel-pur'
  if (slug === 'miel-pur') {
    return TERROIR_PRODUCTS['miel-daghmous-pur'];
  }

  return null;
}
