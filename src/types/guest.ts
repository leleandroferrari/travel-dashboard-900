export interface Guest {
  id?: string; // Implicitly the row number
  name: string;
  roomNumber: string;
  arrivalDate: string;
  departureDate: string;
  status: 'Arriving' | 'In-House' | 'Departed' | 'Cancelled';
  notes: string;
  hotelName: string;
  location: string;
}

export type GuestFormData = Omit<Guest, 'id'>;
