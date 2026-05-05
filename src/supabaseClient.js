import { createClient } from '@supabase/supabase-js';

// Accessing the variables specifically for Create React App
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Diagnostic check: if this shows in your browser console, the .env isn't loading
if (!supabaseUrl) {
    console.error("🚨 Supabase URL is undefined. Ensure .env is in the root folder and variables start with REACT_APP_");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);