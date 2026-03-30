'use client';

import { useState } from 'react';
import { Guest } from '@/types/guest';
import { updateGuestStatus } from '@/actions/guests';
import { Search, Loader2 } from 'lucide-react';

interface DataTableProps {
  initialGuests: Guest[];
  title: string;
}

export function DataTable({ initialGuests, title }: DataTableProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: Guest['status']) => {
    setUpdatingId(id);
    try {
      const res = await updateGuestStatus(id, newStatus);
      if (res.success) {
        setGuests(guests.map(g => g.id === id ? { ...g, status: newStatus } : g));
      } else {
        alert("Failed to update status");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    (g.hotelName || '').toLowerCase().includes(search.toLowerCase()) ||
    (g.location || '').toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Arriving': return 'bg-cyan-100 text-cyan-700';
      case 'In-House': return 'bg-[#50b498]/10 text-[#50b498]';
      case 'Departed': return 'bg-slate-100 text-slate-600';
      case 'Cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-auto w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-6 w-full">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">{guests.length} total records found</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search guests..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#50b498]/20 focus:border-[#50b498] w-full sm:w-64 transition-all"
          />
        </div>
      </div>

      <div className="bg-white border text-sm border-slate-200/60 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-x-auto text-left w-full">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-500">Guest Name</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Dates</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Hotel / Room</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Location</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredGuests.map(guest => (
              <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{guest.name}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 text-xs">
                  <div>Arr: {guest.arrivalDate || '--'}</div>
                  <div className="text-slate-400 mt-0.5">Dep: {guest.departureDate || '--'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-700">{guest.hotelName || '--'}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Room: {guest.roomNumber || 'TBA'}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {guest.location || '--'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {updatingId === guest.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[#50b498]" />
                    ) : (
                      <select 
                        value={guest.status}
                        onChange={(e) => handleStatusChange(guest.id as string, e.target.value as Guest['status'])}
                        className={`text-xs font-semibold rounded-md border-0 py-1.5 pl-2 pr-6 cursor-pointer outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-[#50b498] ${getStatusColor(guest.status)}`}
                      >
                        <option value="Arriving">Arriving</option>
                        <option value="In-House">In-House</option>
                        <option value="Departed">Departed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-[200px] truncate text-slate-500" title={guest.notes}>
                    {guest.notes || '--'}
                  </div>
                </td>
              </tr>
            ))}
            {filteredGuests.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No guests found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
