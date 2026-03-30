import { getGuests } from '@/actions/guests';
import { DataTable } from '@/components/DataTable';

export const dynamic = 'force-dynamic';

export default async function ArrivalsPage() {
  const guests = await getGuests();
  // Filter for upcoming and today's arrivals. For simplicity, we just look at the 'Arriving' status
  // or anyone without a departure status.
  const arrivingGuests = guests.filter(g => g.status === 'Arriving');

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      <DataTable initialGuests={arrivingGuests} title="Arrivals" />
    </div>
  );
}
