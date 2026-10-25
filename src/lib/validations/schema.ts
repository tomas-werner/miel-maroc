import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Address schema
export const addressSchema = z.object({
  recipientName: z.string().min(2, 'Le nom du destinataire est requis'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  city: z.string().min(2, 'La ville est requise'),
  region: z.string().min(2, 'La région est requise'),
  addressLine1: z.string().min(5, 'L\'adresse est requise'),
  addressLine2: z.string().optional(),
  postalCode: z.string().optional(),
  deliveryInstructions: z.string().optional(),
});

// Product schema
export const productSchema = z.object({
  categoryId: z.string().min(1, 'La catégorie est requise'),
  slug: z.string().min(1, 'Le slug est requis').regex(/^[a-z0-9-]+$/, 'Slug invalide'),
  nameFr: z.string().min(2, 'Le nom français est requis'),
  nameAr: z.string().min(2, 'Le nom arabe est requis'),
  descriptionFr: z.string().min(10, 'La description française est requise'),
  descriptionAr: z.string().min(10, 'La description arabe est requise'),
  basePrice: z.number().positive('Le prix doit être positif'),
  currency: z.string().default('MAD'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  isFeatured: z.boolean().default(false),
});

// Category schema
export const categorySchema = z.object({
  parentId: z.string().optional(),
  slug: z.string().min(1, 'Le slug est requis').regex(/^[a-z0-9-]+$/, 'Slug invalide'),
  nameFr: z.string().min(2, 'Le nom français est requis'),
  nameAr: z.string().min(2, 'Le nom arabe est requis'),
  descriptionFr: z.string().optional(),
  descriptionAr: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

// Contact schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  subject: z.string().min(2, 'Le sujet est requis'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});
