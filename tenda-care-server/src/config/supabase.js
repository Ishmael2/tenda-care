// src/config/supabase.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// --- REPLACE THESE CREDENTIALS ---
// You find these in: Project Settings > API
const supabaseUrl = process.env.SUPABASE_URL; // e.g., 'https://xyz.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // The long string starting with 'ey...'

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("🚨 Error: SUPABASE_URL or SUPABASE_ANON_KEY is missing in .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);