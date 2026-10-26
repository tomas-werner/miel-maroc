# Miel Boutique - E-commerce Platform

A modern e-commerce platform for the Moroccan market, built with Next.js, TypeScript, and Prisma.

## Features

- **Bilingual Support**: French and Arabic with full RTL support
- **Product Catalog**: Multi-category product management with variants
- **Shopping Cart**: Client-side cart with localStorage persistence
- **Guest Checkout**: Allow customers to checkout without creating an account
- **Admin Dashboard**: Complete admin panel for products, orders, and inventory
- **Shipping Zones**: Configurable shipping zones and rates
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimized**: Proper metadata and sitemap generation

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database URL and other secrets.

4. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma generate
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Localized routes (fr, ar)
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── products/         # Product-related components
│   ├── cart/             # Cart components
│   ├── checkout/         # Checkout components
│   ├── admin/            # Admin components
│   └── shared/           # Shared components
├── lib/                  # Utility libraries
│   ├── db/              # Database client
│   ├── auth/            # Authentication configuration
│   ├── utils/           # Utility functions
│   └── validations/     # Zod schemas
├── locales/             # Translation files
├── types/               # TypeScript types
└── store/              # Zustand stores
```

## Default Admin Account

After running the seed script, you can access the admin panel with:

- Email: `admin@miel.ma`
- Password: `admin123`

**Important**: Change this password in production!

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed the database with sample data

## Database Schema

The application uses the following main entities:

- **Category**: Product categories with hierarchy
- **Product**: Products with variants and images
- **ProductVariant**: Product variants (size, color, etc.)
- **Inventory**: Stock management
- **Customer**: Customer accounts
- **Order**: Orders with items and status
- **Payment**: Payment transactions
- **ShippingZone**: Delivery zones and rates
- **AdminUser**: Admin accounts

## Language Support

The platform supports:
- French (fr) - LTR
- Arabic (ar) - RTL

Translation files are located in `src/locales/`.

## Payment Integration

The platform is designed to work with various payment providers. The current implementation supports:
- Stripe (to be configured)
- Other providers can be added via the Payment model

## License

Proprietary - All rights reserved
