import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, preferredLocale } = body;

    // Validate required fields
    if (!password || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if customer already exists by email or phone
    const orConditions: Array<{ email: string } | { phone: string }> = [{ phone }];
    if (email) {
      orConditions.push({ email });
    }

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: orConditions,
      }
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        email: email || null,
        passwordHash,
        firstName,
        lastName,
        phone,
        preferredLocale: preferredLocale || 'fr',
      }
    });

    return NextResponse.json(
      { 
        message: 'Customer created successfully',
        customer: {
          id: customer.id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
