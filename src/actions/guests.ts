'use server';

import { getGoogleSheetsClient, SPREADSHEET_ID } from '@/lib/google-sheets';
import { Guest, GuestFormData } from '@/types/guest';
import { revalidatePath } from 'next/cache';

const SHEET_NAME = 'Guests';
const RANGE = `${SHEET_NAME}!A2:H`;

// Maps row array to a Guest object
function mapRowToGuest(row: string[], index: number): Guest {
  // index 0 of values means row 2 in the sheet
  const rowNumber = index + 2; 
  return {
    id: rowNumber.toString(),
    name: row[0] || '',
    roomNumber: row[1] || '',
    arrivalDate: row[2] || '',
    departureDate: row[3] || '',
    status: (row[4] || 'Arriving') as Guest['status'],
    notes: row[5] || '',
    hotelName: row[6] || '',
    location: row[7] || '',
  };
}

// Maps Guest object to a row array
function mapGuestToRow(guest: GuestFormData): string[] {
  return [
    guest.name,
    guest.roomNumber,
    guest.arrivalDate,
    guest.departureDate,
    guest.status,
    guest.notes,
    guest.hotelName,
    guest.location,
  ];
}

export async function getGuests(): Promise<Guest[]> {
  try {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }
    
    // We only preserve rows that actually have data (at least a name)
    return rows
      .map((row, index) => mapRowToGuest(row, index))
      .filter((g) => g.name !== '');
  } catch (error) {
    console.error("Error fetching guests:", error);
    return [];
  }
}

export async function addGuest(data: GuestFormData) {
  try {
    const sheets = await getGoogleSheetsClient();
    const values = [mapGuestToRow(data)];
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    revalidatePath('/');
    revalidatePath('/arrivals');
    revalidatePath('/departures');
    return { success: true };
  } catch (error) {
    console.error("Error adding guest:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateGuest(id: string, data: Partial<GuestFormData>) {
  try {
    const sheets = await getGoogleSheetsClient();
    
    // To update, we first fetch the existing row to not overwrite fields we didn't send
    const rowRange = `${SHEET_NAME}!A${id}:H${id}`;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: rowRange,
    });
    
    const currentRow = response.data.values ? response.data.values[0] : Array(8).fill('');
    
    // Construct the new row merging existing data and new data
    const newRow = [
      data.name !== undefined ? data.name : currentRow[0],
      data.roomNumber !== undefined ? data.roomNumber : currentRow[1],
      data.arrivalDate !== undefined ? data.arrivalDate : currentRow[2],
      data.departureDate !== undefined ? data.departureDate : currentRow[3],
      data.status !== undefined ? data.status : currentRow[4],
      data.notes !== undefined ? data.notes : currentRow[5],
      data.hotelName !== undefined ? data.hotelName : currentRow[6],
      data.location !== undefined ? data.location : currentRow[7],
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: rowRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [newRow],
      },
    });

    revalidatePath('/');
    revalidatePath('/arrivals');
    revalidatePath('/departures');
    return { success: true };
  } catch (error) {
    console.error("Error updating guest:", error);
    return { success: false, error: (error as Error).message };
  }
}
export async function updateGuestStatus(id: string, status: Guest['status']) {
  return updateGuest(id, { status });
}
