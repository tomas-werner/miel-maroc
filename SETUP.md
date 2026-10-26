# Setup Instructions

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/miel_db?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# App Configuration
NEXT_PUBLIC_APP_NAME="Miel Boutique"
NEXT_PUBLIC_DEFAULT_CURRENCY="MAD"
NEXT_PUBLIC_DEFAULT_LOCALE="fr"

# Payment Provider (to be configured)
# STRIPE_SECRET_KEY=""
# STRIPE_WEBHOOK_SECRET=""

# Email (to be configured)
# SMTP_HOST=""
# SMTP_PORT=""
# SMTP_USER=""
# SMTP_PASSWORD=""

# Storage (to be configured)
# STORAGE_BUCKET=""
# STORAGE_REGION=""
# STORAGE_ACCESS_KEY=""
# STORAGE_SECRET_KEY=""
```

## Database Setup

1. Install PostgreSQL and create a database:
```bash
createdb miel_db
```

2. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

3. Generate Prisma Client:
```bash
npx prisma generate
```

## Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Admin Access

After setting up the database, you'll need to create an admin user. This can be done through a seed script or directly in the database.
