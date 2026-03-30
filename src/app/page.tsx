import { getGuests } from '@/actions/guests';
import { DashboardClient } from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const guests = await getGuests();

  // Calculate Metrics safely
  let arrivalsToday = 0;
  let departuresToday = 0;
  let inHouse = 0;

  guests.forEach(g => {
    try {
      if (g.status === 'Arriving') arrivalsToday++;
      if (g.status === 'Departed') departuresToday++;
      if (g.status === 'In-House') inHouse++;
      // If we strictly wanted "isToday(parseISO(g.arrivalDate))", we'd do that. 
      // But status seems to be the primary metric source per brief.
    } catch {
      // ignore parse errors
    }
  });

  const totalToday = arrivalsToday + inHouse; // Approximation for 'Total Guests Today'

  // Filter for grid views
  const arrivingGuests = guests.filter(g => g.status === 'Arriving').slice(0, 6); // Max 6 for dashboard
  const inHouseGuests = guests.filter(g => g.status === 'In-House').slice(0, 6);

  return (
    <div className="flex-1 p-4 md:p-8 overflow-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">Today&apos;s guest management summary</p>
        </div>
        <DashboardClient guests={guests} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <div className="bg-white p-6 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Guests</div>
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">{totalToday}</div>
          </div>
          <div className="bg-slate-50/80 p-3.5 rounded-2xl text-slate-400">
            {/* icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-cyan-100 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest mb-2">Arrivals Today</div>
            <div className="text-4xl font-extrabold text-cyan-700 tracking-tight">{arrivalsToday}</div>
          </div>
          <div className="bg-cyan-50/80 p-3.5 rounded-2xl text-cyan-500 relative z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Departures Today</div>
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">{departuresToday}</div>
          </div>
          <div className="bg-slate-50/80 p-3.5 rounded-2xl text-slate-500 relative z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </div>
        </div>

        <div className="bg-gradient-to-br border border-[#50b498]/30 from-white to-[#50b498]/5 p-6 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#50b498]/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="text-[11px] font-bold text-[#50b498] uppercase tracking-widest mb-2">In-House</div>
            <div className="text-4xl font-extrabold text-[#50b498] tracking-tight">{inHouse}</div>
          </div>
          <div className="bg-[#50b498]/10 p-3.5 rounded-2xl text-[#50b498] relative z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Incoming Arrivals</h2>
            <span className="text-xs font-bold bg-slate-200/50 text-slate-600 px-3 py-1.5 rounded-full">{arrivingGuests.length} Guests</span>
          </div>
          <DashboardClient guests={arrivingGuests} view="cards" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Currently In-House</h2>
            <span className="text-xs font-bold bg-[#50b498]/10 text-[#50b498] px-3 py-1.5 rounded-full">{inHouseGuests.length} Guests</span>
          </div>
          <DashboardClient guests={inHouseGuests} view="cards" />
        </div>
      </div>
    </div>
  );
}
