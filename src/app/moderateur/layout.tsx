import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/helpers';

export default async function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || (user.userType !== 'admin' && user.userType !== 'moderator')) {
    redirect('/moderateur/connexion');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
