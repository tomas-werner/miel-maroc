import { getServerSession } from 'next-auth';
import { authOptions } from './config';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/fr/connexion');
  }
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.userType !== 'admin') {
    redirect('/admin/connexion');
  }
  return user;
}

export async function requireModerator() {
  const user = await getCurrentUser();
  if (!user || (user.userType !== 'admin' && user.userType !== 'moderator')) {
    redirect('/admin/connexion');
  }
  return user;
}

export async function requireCustomer() {
  const user = await getCurrentUser();
  if (!user || user.userType !== 'customer') {
    redirect('/fr/connexion');
  }
  return user;
}
