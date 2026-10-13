import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL ??
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ??
  import.meta.env.SUPABASE_URL
)?.trim();
const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  import.meta.env.SUPABASE_ANON_KEY
)?.trim();

const missingConfigurationMessage =
  'Supabase is not configured. Set the public Supabase URL and anon key in the deployment environment.';

function createUnavailableClient() {
  const unavailable = () => Promise.resolve({
    data: { session: null, user: null },
    error: new Error(missingConfigurationMessage),
  });

  return {
    auth: {
      getSession: unavailable,
      signInWithPassword: unavailable,
      signUp: unavailable,
      signInWithOAuth: unavailable,
      signOut: unavailable,
      onAuthStateChange: (callback: (event: string, session: null) => void) => ({
        data: { subscription: { unsubscribe: () => undefined } },
      }),
    },
  } as unknown as SupabaseClient;
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createUnavailableClient();
