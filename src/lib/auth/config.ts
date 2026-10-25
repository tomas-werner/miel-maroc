import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        userType: { label: 'User Type', type: 'text' } // 'customer' or 'admin'
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const userType = credentials.userType || 'customer';

        if (userType === 'admin') {
          // Admin authentication
          const adminUser = await prisma.adminUser.findUnique({
            where: { email: credentials.email }
          });

          if (!adminUser || !adminUser.isActive) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            adminUser.passwordHash
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: adminUser.id,
            email: adminUser.email,
            role: adminUser.role,
            userType: adminUser.role === 'MODERATOR' ? 'moderator' : 'admin'
          };
        } else {
          // Customer authentication
          const customer = await prisma.customer.findUnique({
            where: { email: credentials.email }
          });

          if (!customer || !customer.passwordHash) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            customer.passwordHash
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: customer.id,
            email: customer.email || customer.phone,
            firstName: customer.firstName,
            lastName: customer.lastName,
            preferredLocale: customer.preferredLocale,
            userType: 'customer'
          };
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/fr/connexion',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userType = user.userType;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.preferredLocale = user.preferredLocale;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.userType = token.userType as 'admin' | 'moderator' | 'customer';
        session.user.role = token.role as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.preferredLocale = token.preferredLocale as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
