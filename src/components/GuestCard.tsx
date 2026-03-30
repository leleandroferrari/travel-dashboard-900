import { MapPin, Calendar, Building, BedDouble, Edit2 } from 'lucide-react';
import { Guest } from '@/types/guest';
import { format, parseISO, isValid } from 'date-fns';

interface GuestCardProps {
  guest: Guest;
  onEdit: (guest: Guest) => void;
}

export function GuestCard({ guest, onEdit }: GuestCardProps) {
  // Safe date parsing helper
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '--';
      const parsed = parseISO(dateString);
      return isValid(parsed) ? format(parsed, 'MMM d') : dateString;
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Arriving': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'In-House': return 'bg-[#50b498]/10 text-[#50b498] border-[#50b498]/20';
      case 'Departed': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Cancelled': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-xl font-bold text-slate-900 line-clamp-1 tracking-tight">{guest.name || 'Unknown Guest'}</h3>
          <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1.5 font-medium">
            <MapPin className="h-3.5 w-3.5" />
            <span>{guest.location || 'No Location'}</span>
          </div>
        </div>
        <button 
          onClick={() => onEdit(guest)}
          className="p-1.5 text-slate-400 hover:text-[#50b498] hover:bg-slate-50 rounded-full transition-colors"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-slate-100/80">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Arrival
          </div>
          <div className="text-sm font-semibold text-slate-900">{formatDate(guest.arrivalDate)}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Departure
          </div>
          <div className="text-sm font-semibold text-slate-900">{formatDate(guest.departureDate)}</div>
        </div>
      </div>

      <div className="space-y-3.5 flex-1 mb-5">
        <div className="flex items-start gap-2.5">
          <Building className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <div className="text-[15px] font-medium text-slate-800 line-clamp-1">{guest.hotelName || 'No Hotel'}</div>
        </div>
        <div className="flex items-start gap-2.5">
          <BedDouble className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <div className="text-[15px] text-slate-600">
            Room: <span className="font-bold text-slate-900">{guest.roomNumber || 'TBA'}</span>
          </div>
        </div>
        {guest.notes && (
          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-100 p-2.5 rounded-xl line-clamp-2 mt-3 font-medium leading-relaxed">
            {guest.notes}
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-50">
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${getStatusColor(guest.status)}`}>
          {guest.status || 'Unknown'}
        </span>
      </div>
    </div>
  );
}
