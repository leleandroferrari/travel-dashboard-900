import { getGuests } from '@/actions/guests';
import { DataTable } from '@/components/DataTable';

export const dynamic = 'force-dynamic';

export default async function ArrivalsPage() {
  const result = await getGuests();

  if ('error' in result) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-2">Google Sheets Connection Error</h2>
          <p className="font-mono text-sm bg-white/50 p-4 rounded-xl border border-red-100">{result.error}</p>
        </div>
      </div>
    );
  }

  const arrivingGuests = result.filter(g => g.status === 'Arriving');

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      <DataTable initialGuests={arrivingGuests} title="Arrivals" />
    </div>
  );
}
