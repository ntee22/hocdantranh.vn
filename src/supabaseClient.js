import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ijrrhxirljbyppaowzkn.supabase.co"; 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqcnJoeGlybGpieXBwYW93emtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Nzk0MTgsImV4cCI6MjA4MDM1NTQxOH0.1NJjq3QVqSXZhrkNKuouBvtLlAMbMmuCjPGFXL9ULR8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'sb-auth-token', // Explicit storage key
    flowType: 'pkce', // Use PKCE flow for better security
  },
  global: {
    headers: {
      'x-client-info': 'hocdantranh-web',
    },
  },
});
