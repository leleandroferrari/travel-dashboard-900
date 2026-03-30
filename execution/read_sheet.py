import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
SPREADSHEET_ID = '1bgiXpYnF35uo30WG9igZwqJVsNd18rP-ZbkLVYlmvs8'
RANGE_NAME = 'A1:Z5'  # Read the first few rows to get headers and some sample data

def main():
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    else:
        print("Error: token.json not found. Please authenticate first.")
        return

    try:
        service = build('sheets', 'v4', credentials=creds)
        sheet = service.spreadsheets()
        
        # Read the sheet properties to get the sheet name
        spreadsheets_get = sheet.get(spreadsheetId=SPREADSHEET_ID).execute()
        sheet_title = spreadsheets_get.get('sheets', [])[0].get('properties', {}).get('title', 'Sheet1')
        
        # Fetch the range
        result = sheet.values().get(spreadsheetId=SPREADSHEET_ID, range=f"'{sheet_title}'!{RANGE_NAME}").execute()
        values = result.get('values', [])

        if not values:
            print('No data found.')
        else:
            print(f"--- Sheet Structure ({sheet_title}) ---")
            for row in values:
                print(row)
    except Exception as err:
        print(f"An error occurred: {err}")

if __name__ == '__main__':
    main()
