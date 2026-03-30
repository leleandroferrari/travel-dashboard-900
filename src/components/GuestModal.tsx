'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Guest, GuestFormData } from '@/types/guest';
import { X, Loader2 } from 'lucide-react';
import { addGuest, updateGuest } from '@/actions/guests';

const guestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  roomNumber: z.string().optional(),
  arrivalDate: z.string().min(1, 'Arrival Date is required'),
  departureDate: z.string().min(1, 'Departure Date is required'),
  status: z.enum(['Arriving', 'In-House', 'Departed', 'Cancelled']),
  notes: z.string().optional(),
  hotelName: z.string().min(1, 'Hotel Name is required'),
  location: z.string().optional(),
});

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest?: Guest | null;
}

export function GuestModal({ isOpen, onClose, guest }: GuestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof guestSchema>>({
    resolver: zodResolver(guestSchema),
    defaultValues: guest || {
      name: '',
      roomNumber: '',
      arrivalDate: '',
      departureDate: '',
      status: 'Arriving',
      notes: '',
      hotelName: '',
      location: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: z.infer<typeof guestSchema>) => {
    setIsSubmitting(true);
    try {
      if (guest && guest.id) {
        await updateGuest(guest.id, data as GuestFormData);
      } else {
        await addGuest(data as GuestFormData);
      }
      onClose();
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50 shrink-0">
          <h2 className="text-xl font-semibold text-slate-800">
            {guest ? 'Edit Guest' : 'New Guest'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto w-full">
          <form id="guest-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Guest Name</label>
              <input type="text" {...register('name')} className="w-full rounded-lg border-slate-200 border p-2 text-sm focus:border-[#50b498] focus:ring-1 focus:ring-[#50b498] outline-none transition-all" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Arrival Date</label>
                <input type="date" {...register('arrivalDate')} className="w-full rounded-lg border-slate-200 border p-2 text-sm focus:border-[#50b498] focus:ring-1 focus:ring-[#50b498] outline-none transition-all" />
                {errors.arrivalDate && <p className="text-red-500 text-xs mt-1">{errors.arrivalDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Departure Date</label>
                <input type="date" {...register('departureDate')} className="w-full rounded-lg border-slate-200 border p-2 text-sm focus:border-[#50b498] focus:ring-1 focus:ring-[#50b498] outline-none transition-all" />
                {errors.departureDate && <p className="text-red-500 text-xs mt-1">{errors.departureDate.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hotel Name</label>
                <input type="text" {...register('hotelName')} className="w-full rounded-lg border-slate-200 border p-2 text-sm focus:border-[#50b498] focus:ring-1 focus:ring-[#50b498] outline-none transition-all" />
                {errors.hotelName && <p className="text-red-500 text-xs mt-1">{errors.hotelName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Room Number</label>
                <input type="text" {...register('roomNumber')} className="w-full rounded-lg border-slate-200 border p-2 text-sm focus:border-[#50b498] focus:ring-1 focus:ring-[#50b498] outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select {...register('status')} className="w-full rounded-lg border-slate-200 border p-2 text-sm focus:border-[#50b498] focus:ring-1 focus:ring-[#50b498] outline-none transition-all bg-white">
                  <option value="Arriving">Arriving</option>
                  <option value="In-House">In-House</option>
                  <option value="Departed">Departed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location / Dest</label>
                <input type="text" {...register('location')} className="w-full rounded-lg border-slate-200 border p-2 text-sm focus:border-[#50b498] focus:ring-1 focus:ring-[#50b498] outline-none transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea {...register('notes')} rows={3} className="w-full rounded-lg border-slate-200 border p-2 text-sm focus:border-[#50b498] focus:ring-1 focus:ring-[#50b498] outline-none transition-all resize-none"></textarea>
            </div>
          </form>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            form="guest-form" 
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#50b498] rounded-lg hover:bg-[#439b82] transition-colors flex items-center justify-center min-w-[100px]"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Guest'}
          </button>
        </div>
      </div>
    </div>
  );
}
