import React from 'react';
import Link from 'next/link';
import { Key } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'AI Agent Dashboard' }: HeaderProps) {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">{title}</Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li><Link href="/" className="hover:text-gray-300">Dashboard</Link></li>
            <li><Link href="/agents/new" className="hover:text-gray-300">New Agent</Link></li>
            <li>
              <Link href="/settings/credentials" className="flex items-center hover:text-gray-300">
                <Key size={16} className="mr-1" />
                <span>Credentials</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
