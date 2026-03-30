'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserMinus } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Arrivals', href: '/arrivals', icon: Users },
  { name: 'Departures', href: '/departures', icon: UserMinus },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/60 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] z-50 px-6 py-3 flex justify-between items-center safe-area-pb">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all px-4 py-2 rounded-xl ${
              isActive ? 'text-[#50b498]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <item.icon className={`h-5 w-5 ${isActive ? 'text-[#50b498]' : ''}`} />
            <span className="text-[10px] font-semibold">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
