import {
  Component, inject, signal, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { EnvironmentService } from '../../core/services/environment.service';
import { IconSvgComponent } from '../../shared/components/icon-svg.component';

interface AdminUserForm {
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconSvgComponent],
  template: `
    <div class="space-y-6 max-w-2xl">

      <!-- Page Header -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Profile</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account and create admin users</p>
      </div>

      <!-- Profile Card -->
      <div class="card p-6">
        <div class="flex items-center gap-2 mb-5">
          <app-icon-svg name="lucideUser" size="15" class="text-gray-500" />
          <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Account Info
          </h3>
        </div>

        <div class="flex items-center gap-4">
          <!-- Avatar -->
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700
                      flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md">
            {{ auth.user()?.username?.charAt(0)?.toUpperCase() }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="font-bold text-gray-900 dark:text-white text-lg leading-tight truncate">
              {{ auth.user()?.username }}
            </p>
            <span class="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold
                         bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <app-icon-svg name="lucideShieldCheck" size="11" />
              {{ auth.user()?.role }}
            </span>
          </div>
        </div>

        <!-- Detail rows -->
        <div class="mt-5 divide-y divide-gray-50 dark:divide-gray-800">
          <div class="flex items-center justify-between py-3">
            <div class="flex items-center gap-2">
              <app-icon-svg name="lucideMail" size="13" class="text-gray-400" />
              <span class="text-sm text-gray-500 dark:text-gray-400">Email</span>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 font-mono truncate max-w-xs">
              {{ auth.user()?.username }}
            </span>
          </div>
          <div class="flex items-center justify-between py-3">
            <div class="flex items-center gap-2">
              <app-icon-svg name="lucideKey" size="13" class="text-gray-400" />
              <span class="text-sm text-gray-500 dark:text-gray-400">Access Level</span>
            </div>
            <span class="text-sm font-semibold text-primary-600 dark:text-primary-400 capitalize">
              Full Admin Access
            </span>
          </div>
          <div class="flex items-center justify-between py-3">
            <div class="flex items-center gap-2">
              <app-icon-svg name="lucideDatabase" size="13" class="text-gray-400" />
              <span class="text-sm text-gray-500 dark:text-gray-400">Auth Provider</span>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Supabase Auth</span>
          </div>
        </div>
      </div>

      <!-- Create Admin User Card -->
      <div class="card p-6">
        <div class="flex items-center gap-2 mb-1">
          <app-icon-svg name="lucideUserPlus" size="15" class="text-primary-500" />
          <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Create New Admin User
          </h3>
        </div>
        <p class="text-xs text-gray-400 mb-5">
          Invite another admin to manage the dashboard. The account will be created with full admin privileges.
        </p>

        <!-- Success banner -->
        @if (successMsg()) {
          <div class="flex items-center gap-2.5 p-3.5 mb-4 bg-green-50 dark:bg-green-900/10
                      border border-green-100 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400">
            <app-icon-svg name="lucideCircleCheck" size="16" class="flex-shrink-0" />
            <span>{{ successMsg() }}</span>
          </div>
        }

        <!-- Error banner -->
        @if (errorMsg()) {
          <div class="flex items-center gap-2.5 p-3.5 mb-4 bg-red-50 dark:bg-red-900/10
                      border border-red-100 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
            <app-icon-svg name="lucideCircleX" size="16" class="flex-shrink-0" />
            <span>{{ errorMsg() }}</span>
          </div>
        }

        <form #createForm="ngForm" (ngSubmit)="createAdminUser()" class="space-y-4">

          <!-- Email -->
          <div>
            <label for="new-admin-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <div class="relative">
              <app-icon-svg name="lucideMail" size="15"
                class="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                id="new-admin-email"
                type="email"
                name="email"
                [(ngModel)]="form.email"
                required
                email
                placeholder="newadmin@example.com"
                class="input ps-9 w-full"
                [disabled]="loading()" />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="new-admin-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <div class="relative">
              <app-icon-svg name="lucideLock" size="15"
                class="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                id="new-admin-password"
                [type]="showPassword() ? 'text' : 'password'"
                name="password"
                [(ngModel)]="form.password"
                required
                minlength="8"
                placeholder="Min 8 characters"
                class="input ps-9 pe-10 w-full"
                [disabled]="loading()" />
              <button type="button" (click)="showPassword.set(!showPassword())"
                class="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <app-icon-svg [name]="showPassword() ? 'lucideEyeOff' : 'lucideEye'" size="15" />
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="new-admin-confirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Confirm Password
            </label>
            <div class="relative">
              <app-icon-svg name="lucideLock" size="15"
                class="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                id="new-admin-confirm"
                [type]="showPassword() ? 'text' : 'password'"
                name="confirmPassword"
                [(ngModel)]="form.confirmPassword"
                required
                placeholder="Repeat password"
                class="input ps-9 w-full"
                [class.border-red-400]="form.confirmPassword && form.password !== form.confirmPassword"
                [disabled]="loading()" />
            </div>
            @if (form.confirmPassword && form.password !== form.confirmPassword) {
              <p class="text-xs text-red-500 mt-1">Passwords do not match</p>
            }
          </div>

          <!-- Submit -->
          <div class="pt-1">
            <button
              type="submit"
              id="create-admin-btn"
              class="btn-primary w-full gap-2 justify-center"
              [disabled]="loading() || !form.email || !form.password || form.password !== form.confirmPassword">
              @if (loading()) {
                <app-icon-svg name="lucideLoaderCircle" size="15" class="animate-spin" />
                Creating admin…
              } @else {
                <app-icon-svg name="lucideUserPlus" size="15" />
                Create Admin User
              }
            </button>
          </div>
        </form>
      </div>

    </div>
  `
})
export class ProfileComponent {
  auth = inject(AuthService);
  private env = inject(EnvironmentService);
  private cdr = inject(ChangeDetectorRef);

  loading = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  showPassword = signal(false);

  form: AdminUserForm = { email: '', password: '', confirmPassword: '' };

  async createAdminUser(): Promise<void> {
    if (this.form.password !== this.form.confirmPassword) return;

    this.loading.set(true);
    this.successMsg.set('');
    this.errorMsg.set('');

    try {
      const supabaseUrl = this.env.getSupabaseUrl();
      // Use the service role token from the current session (admin-level JWT)
      const token = this.auth.getToken();

      if (!token) {
        this.errorMsg.set('Not authenticated. Please log in again.');
        return;
      }

      // Step 1: Create the user via Supabase Admin API
      const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.env.getSupabaseKey(),
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: this.form.email,
          password: this.form.password,
          email_confirm: true,
          app_metadata: { role: 'admin' },
        }),
      });

      const data = await createRes.json();

      if (!createRes.ok) {
        this.errorMsg.set(data?.msg || data?.message || 'Failed to create user.');
        return;
      }

      this.successMsg.set(`✅ Admin user "${this.form.email}" created successfully!`);
      this.form = { email: '', password: '', confirmPassword: '' };
    } catch (err: any) {
      this.errorMsg.set(err?.message || 'Unexpected error. Try again.');
    } finally {
      this.loading.set(false);
      this.cdr.markForCheck();
    }
  }
}
