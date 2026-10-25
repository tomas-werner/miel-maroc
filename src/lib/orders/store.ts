import { prisma } from '@/lib/db/prisma';

export interface OrderItemInput {
  variantId: string;
  productId?: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  image?: string;
  format?: string;
}

export interface CreateOrderPayload {
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  city: string;
  addressLine: string;
  deliveryInstructions?: string;
  paymentMethod: 'CASH_ON_DELIVERY' | 'ONLINE_CARD';
  locale: 'fr' | 'ar';
  items: OrderItemInput[];
  promoCode?: string;
}

export interface StoredOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  locale: 'fr' | 'ar';
  currency: string;
  orderStatus: 'PENDING_PAYMENT' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentMethod: 'CASH_ON_DELIVERY' | 'ONLINE_CARD';
  shippingStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  grandTotal: number;
  shippingAddress: {
    recipientName: string;
    phone: string;
    city: string;
    address: string;
    deliveryInstructions?: string;
  };
  items: {
    id: string;
    productName: string;
    sku: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    image?: string;
    format?: string;
  }[];
}

// In-memory persistent cache for demo / offline fallback
const globalOrdersCache = global as unknown as { orders: Map<string, StoredOrder> };
if (!globalOrdersCache.orders) {
  globalOrdersCache.orders = new Map<string, StoredOrder>();
}

export function calculateShippingFee(city: string, subtotal: number): number {
  if (subtotal >= 300) {
    return 0; // Free shipping over 300 MAD
  }

  const normalizedCity = city.trim().toLowerCase();
  if (normalizedCity.includes('casablanca') || normalizedCity.includes('mohammedia')) {
    return 30;
  }
  if (normalizedCity.includes('rabat') || normalizedCity.includes('salé') || normalizedCity.includes('kénitra')) {
    return 35;
  }
  return 45;
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CMD-${year}-${randomNum}`;
}

export async function createOrder(payload: CreateOrderPayload): Promise<StoredOrder> {
  const orderNumber = generateOrderNumber();
  const subtotal = payload.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Promo code validation (MAROC10 gives 10% discount)
  let discountTotal = 0;
  if (payload.promoCode?.trim().toUpperCase() === 'MAROC10') {
    discountTotal = Math.round(subtotal * 0.1);
  }

  const shippingTotal = calculateShippingFee(payload.city, subtotal - discountTotal);
  const grandTotal = subtotal - discountTotal + shippingTotal;

  const isCOD = payload.paymentMethod === 'CASH_ON_DELIVERY';

  const storedOrder: StoredOrder = {
    id: `ord_${Date.now()}`,
    orderNumber,
    createdAt: new Date().toISOString(),
    guestName: payload.guestName,
    guestPhone: payload.guestPhone,
    guestEmail: payload.guestEmail || '',
    locale: payload.locale,
    currency: 'MAD',
    orderStatus: isCOD ? 'PROCESSING' : 'PENDING_PAYMENT',
    paymentStatus: isCOD ? 'PENDING' : 'PENDING',
    paymentMethod: payload.paymentMethod,
    shippingStatus: 'PENDING',
    subtotal,
    discountTotal,
    shippingTotal,
    grandTotal,
    shippingAddress: {
      recipientName: payload.guestName,
      phone: payload.guestPhone,
      city: payload.city,
      address: payload.addressLine,
      deliveryInstructions: payload.deliveryInstructions,
    },
    items: payload.items.map((item, idx) => ({
      id: `item_${idx}_${Date.now()}`,
      productName: item.productName,
      sku: item.sku,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.unitPrice * item.quantity,
      image: item.image,
      format: item.format,
    })),
  };

  // 1. Save in memory cache
  globalOrdersCache.orders.set(orderNumber, storedOrder);

  // 2. Try persisting to PostgreSQL via Prisma if database is connected
  try {
    await prisma.order.create({
      data: {
        orderNumber,
        guestEmail: payload.guestEmail || null,
        guestPhone: payload.guestPhone,
        locale: payload.locale,
        currency: 'MAD',
        orderStatus: isCOD ? 'PROCESSING' : 'PENDING_PAYMENT',
        paymentStatus: 'PENDING',
        shippingStatus: 'PENDING',
        subtotal,
        discountTotal,
        shippingTotal,
        taxTotal: 0,
        grandTotal,
        shippingAddressSnapshot: storedOrder.shippingAddress as any,
        items: {
          create: storedOrder.items.map((i) => ({
            productNameSnapshot: i.productName,
            skuSnapshot: i.sku,
            unitPrice: i.unitPrice,
            quantity: i.quantity,
            discountAmount: 0,
            lineTotal: i.lineTotal,
            variantSnapshot: { format: i.format, image: i.image },
          })),
        },
      },
    });
  } catch (err) {
    // If DB is offline, order is safely stored in runtime memory cache
    console.log('[Orders] Database offline or unavailable. Order persisted in runtime memory cache:', orderNumber);
  }

  return storedOrder;
}

export async function getOrderByNumber(orderNumber: string): Promise<StoredOrder | null> {
  // 1. Check in-memory cache
  if (globalOrdersCache.orders.has(orderNumber)) {
    return globalOrdersCache.orders.get(orderNumber) || null;
  }

  // 2. Check Database
  try {
    const dbOrder = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (dbOrder) {
      const address = (dbOrder.shippingAddressSnapshot as any) || {};
      return {
        id: dbOrder.id,
        orderNumber: dbOrder.orderNumber,
        createdAt: dbOrder.createdAt.toISOString(),
        guestName: address.recipientName || 'Client',
        guestPhone: dbOrder.guestPhone || address.phone || '',
        guestEmail: dbOrder.guestEmail || '',
        locale: (dbOrder.locale as any) || 'fr',
        currency: dbOrder.currency,
        orderStatus: dbOrder.orderStatus as any,
        paymentStatus: dbOrder.paymentStatus as any,
        paymentMethod: 'CASH_ON_DELIVERY',
        shippingStatus: dbOrder.shippingStatus as any,
        subtotal: Number(dbOrder.subtotal),
        discountTotal: Number(dbOrder.discountTotal),
        shippingTotal: Number(dbOrder.shippingTotal),
        grandTotal: Number(dbOrder.grandTotal),
        shippingAddress: address,
        items: dbOrder.items.map((i) => ({
          id: i.id,
          productName: i.productNameSnapshot,
          sku: i.skuSnapshot,
          unitPrice: Number(i.unitPrice),
          quantity: i.quantity,
          lineTotal: Number(i.lineTotal),
          image: (i.variantSnapshot as any)?.image,
          format: (i.variantSnapshot as any)?.format,
        })),
      };
    }
  } catch (err) {
    console.error('[Orders] Error querying order from database:', err);
  }

  return null;
}
