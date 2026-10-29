import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrderByNumber, CreateOrderPayload } from '@/lib/orders/store';

export const runtime = 'nodejs';

// POST: Create a new order (Guest or registered customer)
export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderPayload = await req.json();

    if (!body.guestName?.trim()) {
      return NextResponse.json({ error: 'Le nom complet est obligatoire' }, { status: 400 });
    }
    if (!body.guestPhone?.trim()) {
      return NextResponse.json({ error: 'Le numéro de téléphone est obligatoire' }, { status: 400 });
    }
    if (!body.city?.trim()) {
      return NextResponse.json({ error: 'La ville de livraison est obligatoire' }, { status: 400 });
    }
    if (!body.addressLine?.trim()) {
      return NextResponse.json({ error: "L'adresse de livraison est obligatoire" }, { status: 400 });
    }
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'Le panier ne peut pas être vide' }, { status: 400 });
    }

    const newOrder = await createOrder({
      guestName: body.guestName.trim(),
      guestPhone: body.guestPhone.trim(),
      guestEmail: body.guestEmail?.trim() || '',
      city: body.city.trim(),
      addressLine: body.addressLine.trim(),
      deliveryInstructions: body.deliveryInstructions?.trim() || '',
      paymentMethod: body.paymentMethod || 'CASH_ON_DELIVERY',
      locale: body.locale === 'ar' ? 'ar' : 'fr',
      items: body.items,
      promoCode: body.promoCode?.trim() || '',
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Une erreur est survenue lors de la création de la commande' },
      { status: 500 }
    );
  }
}

// GET: Query order status by orderNumber
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('orderNumber');

    if (!orderNumber) {
      return NextResponse.json({ error: 'Numéro de commande manquant' }, { status: 400 });
    }

    const order = await getOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Order retrieval error:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération de la commande' }, { status: 500 });
  }
}
