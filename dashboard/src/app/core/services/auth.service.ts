import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from '../../models';
import { EnvironmentService } from './environment.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'gm_admin_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase: SupabaseClient | null = null;
  private _user = signal<AuthUser | null>(this.loadUser());

  private readonly configurationError =
    new Error('Authentication is unavailable because Supabase is not configured.');

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  constructor(
    private router: Router,
    private env: EnvironmentService
  ) {
    const supabaseUrl = this.env.getSupabaseUrl().trim();
    const supabaseKey = this.env.getSupabaseKey().trim();

    if (!supabaseUrl || !supabaseKey) {
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);

    // Sync state if session changes
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const user = session.user;
        const role = user?.app_metadata?.['role'] || 'User';
        
        // If not admin, sign out automatically
        if (role !== 'admin') {
          await this.supabase.auth.signOut();
          this._user.set(null);
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        const authUser: AuthUser = {
          username: user.email!,
          role: 'Admin',
          token: session.access_token
        };
        this._user.set(authUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      } else {
        this._user.set(null);
        localStorage.removeItem(STORAGE_KEY);
      }
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    if (!this.supabase) {
      throw this.configurationError;
    }

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      throw error;
    }
    const role = data.user?.app_metadata?.['role'];
    if (role !== 'admin') {
      await this.supabase.auth.signOut();
      return false;
    }
    return true;
  }

  async logout(): Promise<void> {
    if (this.supabase) {
      await this.supabase.auth.signOut();
    }
    this._user.set(null);
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._user()?.token ?? null;
  }

  private loadUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
