import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Siam Travel - Guest Management',
  description: 'Guest management app powered by Google Sheets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-[100dvh] antialiased bg-slate-50">
      <body className={`${inter.className} min-h-[100dvh] flex flex-col md:flex-row bg-slate-50 text-slate-900 selection:bg-[#50b498]/20`}>
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-center p-4 bg-white border-b border-slate-200/60 sticky top-0 z-40">
          <h1 className="text-lg font-bold tracking-widest text-[#50b498] flex items-center gap-1.5">
            <span>SIAM</span>
            <span className="font-light text-slate-400">TRAVEL</span>
          </h1>
        </div>

        <Sidebar />
        <main className="flex-1 md:ml-64 h-full flex flex-col pb-20 md:pb-0 overflow-auto">
          {children}
        </main>
        
        <MobileNav />
      </body>
    </html>
  );
}
