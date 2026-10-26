import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/utils/translations';

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
