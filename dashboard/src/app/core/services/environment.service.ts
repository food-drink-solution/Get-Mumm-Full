import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  private apiUrl: string;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor() {
    // Read from Angular environment variables (NG_APP_* prefix)
    this.apiUrl = (window as any)['NG_APP_API_URL'] ||
                  (typeof (window as any)['ng_app_api_url'] !== 'undefined' ? (window as any)['ng_app_api_url'] : '') ||
                  '/api';
    
    this.supabaseUrl = (window as any)['NG_APP_SUPABASE_URL'] ||
                       (typeof (window as any)['ng_app_supabase_url'] !== 'undefined' ? (window as any)['ng_app_supabase_url'] : '');
    
    this.supabaseKey = (window as any)['NG_APP_SUPABASE_ANON_KEY'] ||
                       (typeof (window as any)['ng_app_supabase_anon_key'] !== 'undefined' ? (window as any)['ng_app_supabase_anon_key'] : '');

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
