'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserMinus, MapPin } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Arrivals', href: '/arrivals', icon: Users },
  { name: 'Departures', href: '/departures', icon: UserMinus },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/60 flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-widest text-[#50b498] flex items-center gap-2">
          <span>SIAM</span>
          <span className="font-light text-slate-400">TRAVEL</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 mt-6">
        <h2 className="text-xs font-semibold text-gray-400 mb-4 px-2 uppercase tracking-wider">Navigation</h2>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-slate-50 text-[#50b498] font-medium'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-[#50b498]' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mock Destinations Section per Brief UI */}
        <div className="mt-10">
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Destinations
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-white border border-gray-100 rounded text-xs text-slate-600">Phuket</span>
              <span className="px-2 py-1 bg-white border border-gray-100 rounded text-xs text-slate-600">Khao Lak</span>
              <span className="px-2 py-1 bg-white border border-gray-100 rounded text-xs text-slate-600">Koh Samui</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
