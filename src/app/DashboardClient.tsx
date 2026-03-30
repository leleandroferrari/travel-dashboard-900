'use client';

import { useState } from 'react';
import { Guest } from '@/types/guest';
import { GuestCard } from '@/components/GuestCard';
import { GuestModal } from '@/components/GuestModal';
import { Plus } from 'lucide-react';

export function DashboardClient({ guests, view = 'button' }: { guests?: Guest[], view?: 'button' | 'cards' | 'table' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const openNew = () => {
    setSelectedGuest(null);
    setIsModalOpen(true);
  };

  const openEdit = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsModalOpen(true);
  };

  if (view === 'button') {
    return (
      <>
        <button 
          onClick={openNew}
          className="bg-[#50b498] text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#439b82] transition-colors shadow-sm font-medium text-sm"
        >
          <Plus className="h-4 w-4" /> Add Guest
        </button>
        <GuestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} guest={selectedGuest} />
      </>
    );
  }

  if (view === 'cards' && guests) {
    if (guests.length === 0) {
      return (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-slate-500 text-sm">No guests found in this list.</p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {guests.map((guest, idx) => (
            <GuestCard key={guest.id || idx} guest={guest} onEdit={openEdit} />
          ))}
        </div>
        <GuestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} guest={selectedGuest} />
      </>
    );
  }

  return null;
}
