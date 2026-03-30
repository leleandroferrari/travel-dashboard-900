import { getGuests } from '@/actions/guests';
import { DataTable } from '@/components/DataTable';
import { isBefore, parseISO, subDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function DeparturesPage() {
  const guests = await getGuests();
  
  // Filter for departed or in-house (to be departed, or recently departed)
  // According to brief: "departing today or in the past 3 days".
  // Let's filter by standard status as well
  const departingGuests = guests.filter(g => {
    if (g.status === 'Departed') return true;
    if (g.status === 'In-House') {
      try {
        const depDate = parseISO(g.departureDate);
        const threeDaysAgo = subDays(new Date(), 3);
        // If departure date is not valid, we can keep them in-house
        if (!isNaN(depDate.getTime())) {
          return isBefore(threeDaysAgo, depDate); // Departing soon or recently
        }
      } catch {
        return false;
      }
      return true;
    }
    return false;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      <DataTable initialGuests={departingGuests} title="Departures" />
    </div>
  );
}
