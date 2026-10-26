# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Domain name (for production)
- SSL certificate (for production)

## Environment Setup

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/miel_db?schema=public"

# NextAuth
NEXTAUTH_SECRET="generate-a-secure-random-string"
NEXTAUTH_URL="http://localhost:3000"  # Change to your production URL

# App Configuration
NEXT_PUBLIC_APP_NAME="Miel Boutique"
NEXT_PUBLIC_DEFAULT_CURRENCY="MAD"
NEXT_PUBLIC_DEFAULT_LOCALE="fr"

# Payment Provider (configure when ready)
# STRIPE_SECRET_KEY="sk_live_..."
# STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (configure when ready)
# SMTP_HOST="smtp.example.com"
# SMTP_PORT="587"
# SMTP_USER="your-email@example.com"
# SMTP_PASSWORD="your-password"

# Storage (configure when ready)
# STORAGE_BUCKET="your-bucket"
# STORAGE_REGION="us-east-1"
# STORAGE_ACCESS_KEY="your-access-key"
# STORAGE_SECRET_KEY="your-secret-key"
```

### 2. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

## Database Setup

### Development

```bash
# Create database
createdb miel_db

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database
npm run db:seed
```

### Production

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Deployment Options

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t miel-boutique .
docker run -p 3000:3000 --env-file .env miel-boutique
```

### Traditional Server

```bash
# Build
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "miel-boutique" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

## Post-Deployment Checklist

- [ ] Change default admin password
- [ ] Configure payment provider
- [ ] Configure email service
- [ ] Configure image storage
- [ ] Set up SSL certificate
- [ ] Configure domain DNS
- [ ] Test all critical paths
- [ ] Set up monitoring and error tracking
- [ ] Configure backups
- [ ] Review and update legal pages

## Default Credentials

**Admin Panel:**
- URL: `/admin/connexion`
- Email: `admin@miel.ma`
- Password: `admin123`

⚠️ **CHANGE THESE IMMEDIATELY AFTER FIRST LOGIN**

## Database Backups

### PostgreSQL Backup

```bash
# Backup
pg_dump miel_db > backup_$(date +%Y%m%d).sql

# Restore
psql miel_db < backup_20241024.sql
```

### Automated Backups

Set up a cron job for daily backups:

```bash
0 2 * * * pg_dump miel_db > /backups/miel_$(date +\%Y\%m\%d).sql
```

## Monitoring

### Error Tracking

Consider integrating:
- Sentry (https://sentry.io)
- LogRocket (https://logrocket.com)

### Analytics

Configure Google Analytics or similar service in the appropriate components.

## Security Considerations

1. **Never commit `.env` file** to version control
2. **Use strong secrets** for NEXTAUTH_SECRET
3. **Enable HTTPS** in production
4. **Keep dependencies updated** with `npm audit fix`
5. **Review security headers** in Next.js config
6. **Implement rate limiting** on API routes
7. **Regular security audits** of the codebase

## Performance Optimization

1. Enable image optimization with Next.js Image component
2. Implement caching strategies
3. Use CDN for static assets
4. Optimize database queries
5. Enable compression
6. Monitor Core Web Vitals

## Scaling Considerations

1. **Database**: Consider read replicas for high traffic
2. **Session Storage**: Use Redis for session storage in production
3. **File Storage**: Use cloud storage (S3, Cloudflare R2)
4. **Load Balancing**: Use load balancer for multiple instances
5. **CDN**: Implement CDN for static assets

## Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Issues

```bash
# Check Prisma connection
npx prisma db push

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Authentication Issues

```bash
# Clear NextAuth session cookies
# Delete cookies in browser or use incognito mode

# Regenerate NextAuth secret
# Update NEXTAUTH_SECRET in .env
```

## Support

For issues or questions:
- Check the documentation in `docs/`
- Review the README.md
- Check the cahier des charges document
