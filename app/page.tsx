import { redirect } from 'next/navigation';

export default function HomePage() {
  // Automatically performs a 307 temporary redirect to /dashboard
  redirect('/dashboard');
}
