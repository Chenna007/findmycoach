import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize the Supabase client only if keys are provided
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (!supabase) {
  console.warn("⚠️ Supabase credentials not found in environment variables.");
  console.warn("⚠️ Please create a .env.local file and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}
