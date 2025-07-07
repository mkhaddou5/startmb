// src/app/dashboard/layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-heading font-bold text-primary">StartMB Dashboard</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </header>

      <main className="max-w-4xl mx-auto p-6">{children}</main>
    </div>
  );
}
