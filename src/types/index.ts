export interface Product {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  basePrice: number;
  currency: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isFeatured: boolean;
  category: {
    id: string;
    nameFr: string;
    nameAr: string;
    slug: string;
  };
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  priceOverride?: number;
  isActive: boolean;
  inventory?: {
    quantityOnHand: number;
    quantityReserved: number;
  };
}

export interface ProductImage {
  id: string;
  storageKey: string;
  altFr?: string;
  altAr?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  variant?: Record<string, string>;
  image?: string;
}

export interface Address {
  recipientName: string;
  phone: string;
  city: string;
  region: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
  deliveryInstructions?: string;
}

export interface ShippingZone {
  id: string;
  nameFr: string;
  nameAr: string;
  fee: number;
  estimatedMinDays: number;
  estimatedMaxDays: number;
  isActive: boolean;
}
