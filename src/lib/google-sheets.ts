import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export const SPREADSHEET_ID = '1bgiXpYnF35uo30WG9igZwqJVsNd18rP-ZbkLVYlmvs8';

export async function getGoogleSheetsClient() {
  try {
    let credentials;
    let token;

    // 1. Try to load from Environment Variables (for Vercel Production)
    if (process.env.GOOGLE_OAUTH_CREDENTIALS && process.env.GOOGLE_OAUTH_TOKEN) {
      credentials = JSON.parse(process.env.GOOGLE_OAUTH_CREDENTIALS);
      token = JSON.parse(process.env.GOOGLE_OAUTH_TOKEN);
    } else {
      // 2. Fall back to local file system (for Local Development)
      const credsPath = path.join(process.cwd(), 'credentials.json');
      const tokenPath = path.join(process.cwd(), 'token.json');
      
      const credentialsRaw = fs.readFileSync(credsPath, 'utf8');
      credentials = JSON.parse(credentialsRaw);
      
      const tokenRaw = fs.readFileSync(tokenPath, 'utf8');
      token = JSON.parse(tokenRaw);
    }
    
    // Set up OAuth2 Client
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web || credentials;
    // Note: fallback array access for redirect_uris if it exists
    const redirectUri = (redirect_uris && redirect_uris.length > 0) ? redirect_uris[0] : 'urn:ietf:wg:oauth:2.0:oob';
    
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);
    
    oAuth2Client.setCredentials(token);
    
    return google.sheets({ version: 'v4', auth: oAuth2Client });
  } catch (error) {
    console.error("Failed to initialize Google Sheets Client:", error);
    throw new Error("Google Sheets Client configuration failed. Check your environment variables or local json files.");
  }
}
