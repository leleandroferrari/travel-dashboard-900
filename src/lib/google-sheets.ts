import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Define the scopes for Google Sheets API (used when generating token normally)
export const SPREADSHEET_ID = '1bgiXpYnF35uo30WG9igZwqJVsNd18rP-ZbkLVYlmvs8';

export async function getGoogleSheetsClient() {
  try {
    // Determine path based on current working directory
    const credsPath = path.join(process.cwd(), 'credentials.json');
    const tokenPath = path.join(process.cwd(), 'token.json');
    
    // Read the secret from credentials
    const credentialsRaw = fs.readFileSync(credsPath, 'utf8');
    const credentials = JSON.parse(credentialsRaw);
    
    // Set up OAuth2 Client
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    
    // Read token.json
    const tokenRaw = fs.readFileSync(tokenPath, 'utf8');
    const token = JSON.parse(tokenRaw);
    
    oAuth2Client.setCredentials(token);
    
    return google.sheets({ version: 'v4', auth: oAuth2Client });
  } catch (error) {
    console.error("Failed to initialize Google Sheets Client:", error);
    throw new Error("Google Sheets Client configuration failed. Ensure credentials.json and token.json exist at the root.");
  }
}
