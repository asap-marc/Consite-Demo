'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/employee', label: 'Employee Timecards' },
  { href: '/equipment', label: 'Equipment Hours' },
  { href: '/materials', label: 'Material Tracking' },
  { href: '/approvals', label: 'Approvals' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b">
        <div className="container mx-auto">
            <ul className="flex space-x-4">
                {links.map(({ href, label }) => (
                <li key={href}>
                    <Link href={href}>
                        <span
                            className={`block px-3 py-4 text-sm font-medium border-b-2 ${
                            pathname === href
                                ? 'border-emerald-500 text-gray-900'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {label}
                        </span>
                    </Link>
                </li>
                ))}
            </ul>
        </div>
    </nav>
  );
}
