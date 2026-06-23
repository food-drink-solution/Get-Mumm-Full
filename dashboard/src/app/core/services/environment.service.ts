import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  private apiUrl: string;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor() {
    let buildApiUrl = '';
    let buildSupabaseUrl = '';
    let buildSupabaseKey = '';
    
    // Angular CLI 15.2+ replaces process.env.NG_APP_* at build time.
    // We use try/catch because if they aren't replaced, 'process' is undefined in the browser.
    try { buildApiUrl = process.env['NG_APP_API_URL'] || ''; } catch(e) {}
    try { buildSupabaseUrl = process.env['NG_APP_SUPABASE_URL'] || ''; } catch(e) {}
    try { buildSupabaseKey = process.env['NG_APP_SUPABASE_ANON_KEY'] || ''; } catch(e) {}

    // Read from window (for runtime injection) or build variables (for build-time replacement)
    this.apiUrl = (window as any)['NG_APP_API_URL'] ||
                  buildApiUrl ||
                  '/api';
    
    this.supabaseUrl = (window as any)['NG_APP_SUPABASE_URL'] ||
                       buildSupabaseUrl ||
                       '';
    
    this.supabaseKey = (window as any)['NG_APP_SUPABASE_ANON_KEY'] ||
                       buildSupabaseKey ||
                       '';

    console.log('[ENV] API URL:', this.apiUrl);
    console.log('[ENV] Supabase configured:', !!this.supabaseUrl);
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  getSupabaseUrl(): string {
    return this.supabaseUrl;
  }

  getSupabaseKey(): string {
    return this.supabaseKey;
  }

  isProduction(): boolean {
    return !this.apiUrl.includes('localhost');
  }
}
