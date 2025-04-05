import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; 
import Header from '@/components/Header'; 
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Agent Management', 
  description: 'Manage and configure your business AI agents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        {/* Header is part of the layout, rendered on all pages */}
        <Header title="AI Agent Management" />
        <main className="container mx-auto px-4 py-8">
            {children} {/* Page content will be injected here */}
        </main>
      </body>
    </html>
  );
}
