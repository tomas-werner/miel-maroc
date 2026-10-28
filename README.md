# 🍯 Miel Boutique — Plateforme E-Commerce

Plateforme e-commerce moderne, bilingue (Français / Arabe avec support RTL complet) et haut de gamme pour le marché marocain, conçue avec **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, et **Prisma ORM**, en s'alignant sur les standards ergonomiques et graphiques de **Shopify** (thèmes de référence *Dawn* / *Sense* et système de design *Shopify Polaris*).

---

## 📑 Sommaire

1. [Fonctionnalités Clés](#-fonctionnalités-clés)
2. [Stack Technique](#-stack-technique)
3. [Démarrage Rapide](#-démarrage-rapide)
   - [Prérequis](#prérequis)
   - [Installation & Initialisation](#installation--initialisation)
   - [Comptes par défaut](#comptes-par-défaut-seeds)
   - [Scripts disponibles](#scripts-disponibles)
   - [Guide de Dépannage : Connexion Admin & Modérateur](#-guide-de-dépannage--connexion-admin--modérateur)
4. [Structure du Projet](#-structure-du-projet)
5. [Architecture de la Base de Données](#-architecture-de-la-base-de-données)
6. [Internationalisation & RTL](#-internationalisation--rtl)
7. [Rapport d'Avancement & Cahier des Charges (Standard Shopify)](#-rapport-davancement--cahier-des-charges-standard-shopify)
   - [1. État des Lieux & Matrice des Fonctionnalités](#1-état-des-lieux--matrice-des-fonctionnalités)
   - [2. Checklist des Éléments et Prérequis](#2-checklist-des-éléments-et-prérequis)
   - [3. Charte Graphique & Spécifications « Style Shopify »](#3-charte-graphique--spécifications--style-shopify-)
   - [4. Système de Gestion Dynamique des Sections & Photos](#4-système-de-gestion-dynamique-des-sections--photos-type-shopify-theme-editor)
   - [5. Manuel de Procédure : Ajout et Exploitation du Customizer](#5-manuel-de-procédure--ajout-et-exploitation-du-customizer)
   - [6. Liste des Nouveaux Composants et Fichiers](#6-liste-des-nouveaux-composants-et-fichiers-à-créer)
   - [7. Plan d'Action & Feuille de Route](#7-plan-daction--feuille-de-route-dimplémentation)
8. [Licence](#-licence)

---

## ✨ Fonctionnalités Clés

- **Bilinguisme intégral (FR / AR)** : Détection de langue, routage localisé `/[locale]` et affichage RTL natif pour l'arabe.
- **Catalogue & Variantes** : Gestion multi-catégories hiérarchique, déclinaisons (poids, contenance, format) et galeries d'images.
- **Panier dynamique** : Panier persistant (`localStorage` + synchronisation Zustand) et vue latérale tiroir (*Drawer Cart*).
- **Processus de commande simplifié** : Tunnel épuré (Informations > Livraison > Paiement), mode invité sans création de compte obligatoire, et intégration WhatsApp directe.
- **Espaces d'Administration & Modération dédiés** :
  - **Admin (`/admin`)** : Gestion complète du catalogue, des stocks, des commandes, des utilisateurs et des paramètres.
  - **Modérateur (`/moderateur`)** : Gestion rapide des produits, mise à jour des stocks et des statistiques.
- **Zones et Frais de Livraison configurables** : Prise en charge des spécificités du marché marocain (Grand Casablanca, Hors Casablanca, Cash on Delivery / Paiement à la livraison).
- **Optimisation SEO & Performance** : Génération de sitemap dynamique, robots.txt, balises OpenGraph et images optimisées.

---

## 🛠 Stack Technique

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Bibliothèque UI** : [React 19](https://react.dev/)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Base de données & ORM** : PostgreSQL avec [Prisma ORM v6](https://www.prisma.io/)
- **Authentification** : [NextAuth.js v4](https://next-auth.js.org/) avec hachage bcryptjs et rôles hiérarchisés (`ADMIN`, `MODERATOR`, `USER`)
- **Gestion d'état** : [Zustand](https://github.com/pmndrs/zustand)
- **Formulaires & Validation** : [React Hook Form](https://react-hook-form.com/) avec résolveurs [Zod](https://zod.dev/)
- **Icônes** : [Lucide React](https://lucide.dev/) (tracés filaires minimalistes style Shopify Polaris)

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** : 18.x ou version supérieure
- **PostgreSQL** : Instance locale ou hébergée (ex: Supabase, Neon, Prisma Postgres)
- **Gestionnaire de paquets** : `npm` ou `yarn`

### Installation & Initialisation

1. **Cloner le projet** et accéder au répertoire :
   ```bash
   git clone <url-du-depot>
   cd miel
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   ```bash
   cp .env.example .env
   ```
   Renseignez vos clés dans le fichier `.env` :
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/miel_db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="votre-secret-aleatoire-32-caracteres"
   NODE_ENV="development"
   ```

4. **Préparer la base de données et charger les données initiales** :
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   npm run db:seed
   ```

5. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```
   L'application est accessible à l'adresse [http://localhost:3000](http://localhost:3000).

---

### 🔑 Comptes par Défaut (Seeds)

Après exécution des scripts de seed (`npm run db:seed` ou `npm run db:seed:admin`), les comptes suivants sont créés :

| Rôle | URL de connexion | Email | Mot de passe |
| :--- | :--- | :--- | :--- |
| **Administrateur** | `/admin/connexion` | `admin@miel.ma` | `admin123` |
| **Modérateur** | `/moderateur/connexion` | `moderator@miel.ma` | `moderator123` |

> ⚠️ **Sécurité** : Pensez impérativement à changer ces identifiants lors d'un déploiement en production !

---

### 📜 Scripts Disponibles

| Commande | Action |
| :--- | :--- |
| `npm run dev` | Lance l'application en mode développement (avec Turbopack) |
| `npm run build` | Compile l'application pour la production |
| `npm start` | Démarre le serveur Node.js en production |
| `npm run lint` | Exécute ESLint pour valider la qualité du code |
| `npm run db:seed` | Remplit la base avec les catégories, produits, variantes et comptes d'administration |
| `npm run db:seed:admin` | Configure ou réinitialise uniquement les comptes Admin et Modérateur (alias: `npm run seed:admin`) |

---

### 🔧 Guide de Dépannage : Connexion Admin & Modérateur

Si vous rencontrez une erreur ou un blocage lors de la tentative de connexion aux espaces `/admin` ou `/moderateur`, voici les étapes de diagnostic et de résolution :

#### 1. Les 4 causes courantes d'échec
1. **Base de données inaccessible ou non démarrée** : `DATABASE_URL` pointe vers une instance PostgreSQL locale inexistante ou éteinte.
2. **Script de seed non exécuté** : Aucun compte n'a encore été inséré dans la table `AdminUser`.
3. **Variables d'environnement NextAuth** : `NEXTAUTH_SECRET` est manquant ou vide (NextAuth refuse alors de créer les cookies de session).
4. **Tentative de connexion au mauvais espace** : Un compte `MODERATOR` tente d'accéder à `/admin` (qui exige strictement le rôle `ADMIN`).

#### 2. Procédure de résolution pas-à-pas

##### Étape 1 : Vérifier le fichier `.env`
Assurez-vous que votre fichier `.env` à la racine contient :
```env
DATABASE_URL="postgresql://utilisateur:motdepasse@localhost:5432/miel_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre_cle_secrete_aleatoire_32_caracteres_minimum"
NODE_ENV="development"
```
> **Note** : Si vous n'avez pas de PostgreSQL installé localement, vous pouvez utiliser une base gratuite hébergée comme [Supabase](https://supabase.com/) ou [Neon](https://neon.tech/) et coller son URI de connexion dans `DATABASE_URL`.

##### Étape 2 : Appliquer les migrations et initialiser les comptes
Exécutez dans votre terminal :
```bash
# 1. Pousser le schéma Prisma vers votre base PostgreSQL
npx prisma db push

# 2. Insérer les comptes administrateur et modérateur
npm run db:seed:admin
# ou : npx tsx scripts/seed-admin.ts
```

##### Étape 3 : Vérifier les utilisateurs dans Prisma Studio
Pour visualiser directement les comptes en base :
```bash
npx prisma studio
```
- Rendez-vous sur `http://localhost:5555`.
- Ouvrez la table **`AdminUser`** (*attention : les comptes admin/modérateurs sont dans `AdminUser` et non dans `User`*).
- Vérifiez la présence de `admin@miel.ma` avec `role = ADMIN` et `moderator@miel.ma` avec `role = MODERATOR`.

##### Étape 4 : Utiliser les bonnes URLs selon le rôle

| Rôle | Page de connexion | Dashboard protégé | Condition d'accès |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `http://localhost:3000/admin/connexion` | `http://localhost:3000/admin` | Rôle `ADMIN` obligatoire |
| **MODERATOR** | `http://localhost:3000/moderateur/connexion` | `http://localhost:3000/moderateur` | Rôle `MODERATOR` ou `ADMIN` |

##### Étape 5 : Redémarrer le serveur et vider les cookies
1. Arrêtez le serveur dans votre terminal (`Ctrl + C`).
2. Supprimez les cookies de session du navigateur pour `localhost` (notamment `next-auth.session-token`).
3. Relancez :
   ```bash
   npm run dev
   ```
4. Connectez-vous sur `http://localhost:3000/admin/connexion`.

---

## 📁 Structure du Projet

```text
miel/
├── prisma/
│   ├── schema.prisma        # Schéma relationnel Prisma
│   └── seed.ts              # Script d'injection du catalogue et des utilisateurs
├── scripts/
│   └── seed-admin.ts        # Script de création rapide des comptes admin/modérateur
├── src/
│   ├── app/                 # Architecture App Router Next.js
│   │   ├── [locale]/        # Routes localisées (fr, ar)
│   │   │   ├── a-propos/    # Page À propos
│   │   │   ├── catalogue/   # Boutique & filtres
│   │   │   ├── commande/    # Tunnel d'achat & checkout
│   │   │   ├── connexion/   # Connexion client
│   │   │   ├── contact/     # Formulaire de contact
│   │   │   ├── panier/      # Page récapitulative panier
│   │   │   └── produits/    # Fiches produits détaillées [slug]
│   │   ├── admin/           # Espace d'administration centralisé (produits, stocks, commandes)
│   │   ├── moderateur/      # Espace modérateur dédié
│   │   └── api/             # Endpoints API REST (auth, catalogue, commandes, modération)
│   ├── components/          # Composants React réutilisables
│   │   ├── admin/           # Composants du tableau de bord
│   │   ├── cart/            # Panier et tiroir latéral (Cart Drawer)
│   │   ├── checkout/        # Étapes de commande
│   │   ├── home/            # Vues et sections de la page d'accueil
│   │   ├── layout/          # En-tête, Pied de page, Navigation mobile
│   │   ├── moderator/       # Outils d'ordonnancement et tableaux modérateur
│   │   ├── products/        # Grilles, cartes et vues détaillées des produits
│   │   └── shared/          # Boutons, inputs, modales et indicateurs
│   ├── lib/                 # Logique métier & utilitaires
│   │   ├── auth/            # Configuration NextAuth & guards de sécurité
│   │   ├── db/              # Client d'accès Prisma
│   │   ├── orders/          # Gestionnaire de commandes
│   │   ├── products/        # Utilitaires du catalogue
│   │   ├── store/           # Stores Zustand (ex: panier)
│   │   └── validations/     # Schémas de validation Zod
│   ├── locales/             # Dictionnaires de traduction bilingues (fr.json, ar.json)
│   └── types/               # Définitions TypeScript
```

---

## 🗄 Architecture de la Base de Données

Le schéma PostgreSQL défini dans `prisma/schema.prisma` s'articule autour des entités suivantes :

- **`Category`** : Hiérarchie des rayons et catégories de miels / dérivés.
- **`Product`** : Informations produit (titres et descriptions FR/AR, marque, prix de base, statut).
- **`ProductVariant`** : Déclinaisons (poids, contenance, SKU unique, prix spécifique).
- **`ProductImage`** : Galerie de photos associées aux produits et variantes.
- **`Inventory` & `InventoryMovement`** : Gestion des stocks en temps réel et traçabilité des mouvements d'entrées/sorties.
- **`Customer`** : Profils clients et adresses de facturation / livraison.
- **`Order` & `OrderItem`** : Commandes passées, statuts, montants et articles associés.
- **`Payment`** : Transactions de paiement (Cash on Delivery, Stripe, CMI).
- **`ShippingZone`** : Découpage géographique des frais et délais de livraison au Maroc.
- **`AdminUser` & `AuditLog`** : Comptes d'accès privilégiés et journalisation de sécurité.
- **`Review`** : Avis clients modérables par les équipes internes.

---

## 🌐 Internationalisation & RTL

L'application intègre une gestion multilingue native :
- **Français (`fr`)** : Direction de lecture de gauche à droite (LTR).
- **Arabe (`ar`)** : Direction de lecture de droite à gauche (RTL) avec adaptation automatique des espacements et icônes.

Les fichiers de traduction sont centralisés dans `src/locales/` (`fr.json` et `ar.json`).

---

# 📋 Rapport d'Avancement & Cahier des Charges (Standard Shopify)

> **Document de référence technique, visuelle et opérationnelle** pour l'audit, l'achèvement et l'alignement complet de la boutique en ligne Miel sur les standards ergonomiques et graphiques de Shopify (thèmes de référence : **Dawn** / **Sense** et système de design **Shopify Polaris**).

---

### 1. État des Lieux & Matrice des Fonctionnalités

#### Architecture existante
- **Framework** : Next.js 16 (App Router) avec TypeScript
- **Styling** : Tailwind CSS v4
- **Persistance** : Prisma ORM avec schéma PostgreSQL (`User`, `Product`, `ProductVariant`, `Order`, `InventoryMovement`, etc.)
- **Authentification** : NextAuth v4 avec rôles hiérarchisés (`ADMIN`, `MODERATOR`, `USER`)
- **Internationalisation** : Routage multilingue `[locale]` (Français / Arabe) avec support RTL/LTR et dictionnaires JSON dédiés

#### Matrice des fonctionnalités

| Composant / Module | Statut Actuel | Alignement Shopify Requis |
| :--- | :--- | :--- |
| **En-tête (Header)** | En place (logo, nav, switch langue) | Ajouter la barre d'annonce défilante (*Announcement Bar*), le panier tiroir déclenchable (*Cart Drawer*) et des icônes filaires minimalistes. |
| **Page d'Accueil** | Vue interactive avec sections statiques | Restructurer en blocs modulaires administrables (Hero, carrousel de collections, bandeau réassurance, avis clients). |
| **Catalogue & Filtres** | Filtres basiques | Tiroir de filtres repliables (gamme, prix, contenance), badges de promotion (« Soldes », « Rupture »). |
| **Fiche Produit (PDP)** | Fiche client avec variantes | Sélecteur de quantité carré compact, accordéons déroulants sous le CTA, aperçu miniature des galeries d'images, barre d'achat flottante (*Sticky Bar*) sur mobile. |
| **Panier (Cart)** | Page statique `/panier` | Implémenter un *Drawer Cart* latéral avec barre de progression pour la livraison offerte et champ de note de commande. |
| **Processus de Commande** | Formulaire simple / WhatsApp | Écrans clairs en étapes épurées (Informations > Livraison > Paiement), récapitulatif latéral rétractable sur mobile. |
| **Espace Admin / Modérateur** | Interface Tailwind fonctionnelle | Harmoniser les tableaux de bord et formulaires selon les composants de données Shopify Polaris. |

---

### 2. Checklist des Éléments et Prérequis

#### A. Médias & Identité Visuelle
- [ ] **Logotype vectoriel** : Fichier SVG (version sombre et version claire pour fond transparent).
- [ ] **Favicons complets** : Formats `16x16`, `32x32`, `180x180` (*Apple Touch Icon*).
- [ ] **Visuels Produits** :
  - Minimum 3 à 5 photos HD par produit (vue de face, gros plan texture/miel, mise en situation avec pot et cuillère).
  - Format recommandé : **WebP** ou **PNG optimisé**, ratio `1:1` (carré 1200×1200 px) ou `3:4`.
  - Arrière-plans neutres, lumineux et épurés (fond blanc cassé `#FBFBFB` ou gris studio `#F3F3F3`).
- [ ] **Bannières & Visuels Éditoriaux** :
  - Hero Desktop : `1920×800 px` (ratio 2.4:1).
  - Hero Mobile : `750×1000 px` (ratio 3:4 vertical).

#### B. Variables d'Environnement & Services Tiers
- [ ] **Base de données** : URL PostgreSQL de production (`DATABASE_URL`).
- [ ] **Stockage Médias** (Cloudinary / AWS S3 / Uploadthing) : Pour téléverser dynamiquement des photos sans redéployer le code.
- [ ] **Sécurité** : `NEXTAUTH_SECRET` et `NEXTAUTH_URL` définitifs.
- [ ] **Passerelle de Paiement** : Clés API (Stripe, CMI, etc.) + configuration *Cash on Delivery* (COD).
- [ ] **Messagerie Transactionnelle** : Fournisseur SMTP ou API (Resend, SendGrid) pour confirmation de commande par email.
- [ ] **Numéro WhatsApp Business** : Format international standardisé pour le bouton d'assistance directe.

---

### 3. Charte Graphique & Spécifications « Style Shopify »

#### 1. Bibliothèque d'icônes
Remplacer les SVG disparates par une suite cohérente calquée sur **Shopify Polaris / Dawn** :
- **Bibliothèque** : `lucide-react` paramétrée avec `strokeWidth={1.25}` ou `strokeWidth={1.5}`.
- **Grille d'alignement** : `20×20 px` (boutons compacts) ou `24×24 px` (barre de navigation).
- **Icônes clés** :
  - **Panier** : Sac de shopping géométrique rectangulaire avec anses fines (`ShoppingBag`).
  - **Recherche** : Loupe filaire minimaliste (`Search`).
  - **Compte** : Silhouette discrète (`User`).
  - **Réassurance** : Camion épuré (`Truck`), Cadenas (`ShieldCheck`), Feuille/Nature (`Leaf`), Étoile (`Star`).

#### 2. Palette de Couleurs (Inspiration Dawn / Miel Haut de Gamme)

```css
:root {
  --color-canvas-bg: #FFFFFF;         /* Fond principal */
  --color-canvas-subtle: #F7F7F7;     /* Cartes & sections secondaires */
  --color-canvas-border: #E5E5E5;     /* Bordures fines */
  --color-text-main: #121212;         /* Noir Shopify */
  --color-text-muted: #666666;        /* Texte secondaire */
  --color-accent-gold: #C68A4C;       /* Accent miel doré */
  --color-accent-amber: #B45309;      /* Hover */
  --color-btn-dark: #121212;          /* Boutons primaires */
  --color-btn-text: #FFFFFF;          /* Texte blanc */
}
```

---

### 4. Système de Gestion Dynamique des Sections & Photos (Type "Shopify Theme Editor")

Pour pouvoir modifier l'emplacement des blocs, changer les photos, éditer les textes et activer/désactiver des sections sans coder, nous mettons en place un moteur de configuration dynamique piloté par la base de données.

#### A. Modèle de Données Prisma à ajouter (`prisma/schema.prisma`)

```prisma
// Modèle pour administrer les sections de la page d'accueil ou de n'importe quelle page
model SiteSection {
  id          String   @id @default(cuid())
  page        String   @default("home") // "home", "about", "header", etc.
  key         String   @unique          // ex: "hero-banner", "featured-products", "trust-badges"
  title       String                    // Titre interne pour l'admin
  type        String                    // "HERO", "FEATURED_COLLECTION", "RICH_TEXT", "TESTIMONIALS", "IMAGE_BANNER"
  position    Int      @default(0)      // Pour l'ordre d'affichage (Drag & Drop)
  isActive    Boolean  @default(true)   // Activer ou masquer la section
  
  // Données de configuration (textes, liens, images, sous-titres) en format JSON flexible
  content     Json     @default("{}")
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([page, position])
}

// Modèle pour la médiathèque (téléchargement et réutilisation de photos)
model MediaAsset {
  id          String   @id @default(cuid())
  url         String
  filename    String
  altText     String?
  size        Int?
  mimeType    String?
  createdAt   DateTime @default(now())
}
```

#### B. Structure du contenu JSON par type de section

Chaque section stocke ses éléments modifiables dans le champ `content` :

##### Section HERO :
```json
{
  "title_fr": "L'Excellence du Miel Pur",
  "title_ar": "عسل طبيعي نقي 100%",
  "subtitle_fr": "Récolté dans le respect des abeilles et des traditions apicoles.",
  "subtitle_ar": "محصول طبيعي من أفضل المناحل المغربية الأصيلة.",
  "buttonText_fr": "Découvrir la collection",
  "buttonText_ar": "اكتشف المجموعة",
  "buttonLink": "/catalogue",
  "backgroundImage": "/images/banners/hero-honey.webp",
  "mobileImage": "/images/banners/hero-honey-mobile.webp",
  "overlayOpacity": 30
}
```

##### Section RÉASSURANCE (Trust Badges) :
```json
{
  "items": [
    { "icon": "Truck", "title_fr": "Livraison Express", "title_ar": "توصيل سريع" },
    { "icon": "ShieldCheck", "title_fr": "Paiement Sécurisé / COD", "title_ar": "الدفع عند الاستلام" },
    { "icon": "Leaf", "title_fr": "100% Naturel et Analysé", "title_ar": "طبيعي 100% ومفحوص" }
  ]
}
```

---

### 5. Manuel de Procédure : Ajout et Exploitation du Customizer

#### Étape 1 : Mettre à jour la base de données
1. Ouvrez votre terminal à la racine du projet.
2. Ajoutez les modèles `SiteSection` et `MediaAsset` dans `prisma/schema.prisma`.
3. Exécutez la migration Prisma :
   ```bash
   npx prisma migrate dev --name add_site_sections_and_media
   npx prisma generate
   ```
4. Lancez le script d'initialisation des sections de base :
   ```bash
   npx tsx scripts/seed-sections.ts
   ```

#### Étape 2 : Créer l'API d'Upload et de Sauvegarde des Images
1. **Création de la route `/api/admin/media/upload`** :
   - Réception d'un `multipart/form-data`.
   - Enregistrement local dans `public/uploads/` ou envoi vers un stockage cloud (Cloudinary / Supabase Storage).
   - Retour de l'URL publique du fichier.
2. **Création de la route `/api/admin/sections`** :
   - `GET` : Récupère les sections ordonnées par `position ASC`.
   - `PUT` : Met à jour l'ordre de tri et le contenu (textes, images, paramètres).

#### Étape 3 : Créer l'interface d'administration "Éditeur de Thème"
Créez la page `/src/app/admin/personnalisation/page.tsx` comprenant :
- **Colonne gauche (Liste des sections & réorganisation)** :
  - Liste des blocs existants avec glisser-déposer (*drag and drop* via `@hello-pangea/dnd` ou boutons Monter/Descendre).
  - Commutateur On/Off pour afficher ou masquer chaque section en 1 clic.
- **Colonne centrale / droite (Panneau d'édition)** :
  - Champs de saisie bilingues (FR / AR) pour les titres et sous-titres.
  - Sélecteur de média avec prévisualisation immédiate et bouton « Changer la photo ».
  - Sélecteur de redirection (lien du bouton vers une page ou un produit spécifique).
- **Bouton d'enregistrement général** :
  - Envoi de la nouvelle disposition à l'API `/api/admin/sections`.

#### Étape 4 : Rendre le Front-Office dynamique
Dans la page d'accueil (`/src/app/[locale]/page.tsx`) :
1. Récupérer les sections activées depuis Prisma :
   ```tsx
   const sections = await prisma.siteSection.findMany({
     where: { page: 'home', isActive: true },
     orderBy: { position: 'asc' }
   });
   ```
2. Parcourir et afficher dynamiquement le composant correspondant :
   ```tsx
   <main>
     {sections.map((section) => {
       switch (section.type) {
         case 'HERO':
           return <ShopifyHero key={section.id} data={section.content} locale={locale} />;
         case 'TRUST_BADGES':
           return <ShopifyTrustBadges key={section.id} data={section.content} locale={locale} />;
         case 'FEATURED_COLLECTION':
           return <ShopifyFeaturedProducts key={section.id} data={section.content} locale={locale} />;
         case 'IMAGE_BANNER':
           return <ShopifyImageBanner key={section.id} data={section.content} locale={locale} />;
         default:
           return null;
       }
     })}
   </main>
   ```

---

### 6. Liste des Nouveaux Composants et Fichiers à Créer

| Fichier à ajouter | Rôle |
| :--- | :--- |
| `src/app/api/admin/sections/route.ts` | API pour lire et mettre à jour la disposition et le contenu des blocs. |
| `src/app/api/admin/media/upload/route.ts` | API d'upload de photos avec validation et redimensionnement. |
| `src/app/admin/personnalisation/page.tsx` | Page d'administration visuelle (*Shopify Theme Customizer*). |
| `src/components/admin/ImageUploader.tsx` | Composant d'aperçu d'image avec sélection de fichier et glisser-déposer. |
| `src/components/admin/SectionItemEditor.tsx` | Formulaire dynamique par bloc (changement textes bilingues, images et liens). |
| `src/components/sections/DynamicSectionRenderer.tsx` | Moteur de rendu du front-office affichant les blocs dans l'ordre dynamique. |

---

### 7. Plan d'Action & Feuille de Route d'Implémentation

```
[Phase 1 : En-tête & Drawer Cart] 
       │
       ▼
[Phase 2 : Système de Gestion des Sections & Upload d'Images] 
       │
       ▼
[Phase 3 : Refonte Fiches Produits & Catalogue Shopify] 
       │
       ▼
[Phase 4 : Écran de Commande & Réassurance] 
       │
       ▼
[Phase 5 : Tests RTL, Performance & Recette Mobile]
```

---

## 📄 Licence

Propriétaire - Tous droits réservés.
