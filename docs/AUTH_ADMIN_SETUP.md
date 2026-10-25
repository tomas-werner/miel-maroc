# Authentication and Admin System Setup

This document describes the authentication and admin system implementation for the Miel Boutique e-commerce platform.

## Overview

The system includes:
- NextAuth.js for authentication
- Separate login flows for customers and admins
- Protected admin routes with server-side validation
- Customer registration and login
- Admin dashboard with product, order, and inventory management

## Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/miel_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NODE_ENV="development"
```

Generate a secret key with:
```bash
openssl rand -base64 32
```

## Database Setup

1. Run Prisma migrations:
```bash
npx prisma migrate dev
```

2. Seed the admin user:
```bash
npx tsx scripts/seed-admin.ts
```

Default admin credentials:
- Email: `admin@miel.ma`
- Password: `admin123`

**Important:** Change the default password after first login!

## File Structure

### Authentication Configuration
- `src/lib/auth/config.ts` - NextAuth configuration with credentials provider
- `src/lib/auth/helpers.ts` - Helper functions for auth checks
- `src/types/next-auth.d.ts` - TypeScript definitions for NextAuth

### API Routes
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API handler
- `src/app/api/auth/register/route.ts` - Customer registration
- `src/app/api/auth/signout/route.ts` - Sign out handler
- `src/app/api/admin/products/route.ts` - Product CRUD
- `src/app/api/admin/orders/route.ts` - Order management
- `src/app/api/admin/inventory/route.ts` - Inventory management
- `src/app/api/admin/inventory/movements/route.ts` - Stock movements
- `src/app/api/admin/categories/route.ts` - Categories list
- `src/app/api/admin/users/route.ts` - Admin user creation

### Customer Pages
- `src/app/[locale]/connexion/page.tsx` - Customer login
- `src/app/[locale]/inscription/page.tsx` - Customer registration

### Admin Pages
- `src/app/admin/connexion/page.tsx` - Admin login
- `src/app/admin/layout.tsx` - Admin layout with navigation
- `src/app/admin/page.tsx` - Admin dashboard
- `src/app/admin/produits/page.tsx` - Products list
- `src/app/admin/produits/nouveau/page.tsx` - Create product form
- `src/app/admin/commandes/page.tsx` - Orders management
- `src/app/admin/stocks/page.tsx` - Inventory management

## Features

### Customer Authentication
- Email/password login
- Registration with email, phone, and personal info
- Session management with NextAuth
- Automatic login after registration
- Locale preference tracking

### Admin Authentication
- Separate admin login flow
- Protected admin routes (server-side)
- Admin-only API endpoints
- Session-based access control

### Admin Dashboard
- Statistics (orders, revenue, products, customers)
- Recent orders list
- Low stock alerts
- Navigation to all admin sections

### Product Management
- List all products with status badges
- Create new products with variants
- Support for French and Arabic names/descriptions
- Category assignment
- Pricing and stock management
- Featured product flag

### Order Management
- List all orders with filtering by status
- Search by order number, customer, or email
- Status indicators (payment, shipping, order)
- Click to view order details

### Inventory Management
- View all inventory items
- Low stock alerts section
- Add stock movements (entries, corrections, returns)
- View recent movements per item
- Stock status indicators (in stock, low stock, out of stock)

## Security Features

- Password hashing with bcryptjs
- Server-side route protection
- Admin-only API endpoints
- Session-based authentication
- CSRF protection via NextAuth

## Translation Support

All customer-facing pages support French and Arabic through the existing translation system. Admin pages are currently in French only but can be extended to support Arabic.

## Future Enhancements

- Email verification for registration
- Password reset functionality
- Two-factor authentication for admins
- Role-based access control (admin, manager, editor)
- Audit logging for admin actions
- Image upload for products
- Bulk product import/export
- Advanced inventory reports
- Order status workflow management
