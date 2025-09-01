import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Wind Speed',
  description: 'Sign in or create your Wind Speed account for renewable energy optimization',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
