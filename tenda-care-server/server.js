import express from 'express';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// 1. Initialize environment variables
dotenv.config();
dotenv.config();

// DIAGNOSTIC LOG: This will show us if the keys exist without revealing the full secret
console.log("--- Environment Variable Check ---");
console.log("SUPABASE_URL exists:", !!process.env.SUPABASE_URL);
console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log("All Keys found:", Object.keys(process.env).filter(k => k.includes('SUPABASE')));
console.log("---------------------------------");

// 2. Define __dirname for ES Modules (Required for ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const STORAGE_PATH = path.join(__dirname, 'tenda_storage');

// 3. Credential Safety Check
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("\n❌ ERROR: Supabase credentials missing!");
  console.error("1. Ensure you have a .env file inside the 'tenda-care-server' folder.");
  console.error("2. Check that it contains SUPABASE_URL and SUPABASE_ANON_KEY.\n");
  process.exit(1); 
}

// 4. Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// 5. THE REAL-TIME BRIDGE: Listening for Cloud Database Changes
console.log('📡 Establishing connection to Supabase Realtime...');

const channel = supabase
  .channel('db-changes')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'interactions' }, 
    (payload) => {
      const { user_id, action_type } = payload.new;
      console.log(`🔔 Cloud Event Detected | User: ${user_id} | Action: ${action_type}`);
      
      // Ensure local storage directory exists
      if (!fs.existsSync(STORAGE_PATH)) {
        fs.mkdirSync(STORAGE_PATH, { recursive: true });
      }

      // Save the synchronized data to the 1TB Local Disk
      const fileName = `sync_${user_id.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.json`;
      const filePath = path.join(STORAGE_PATH, fileName);
      
      try {
        fs.writeFileSync(filePath, JSON.stringify(payload.new, null, 2));
        console.log(`💾 Hardware Sync Successful: ${fileName}`);
      } catch (err) {
        console.error(`❌ Disk Write Error: ${err.message}`);
      }
    }
  )
  .subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log('✅ Realtime Listener Active: Watching for new interactions...');
    }
  });

// 6. Start the Express Interface
const PORT = 3000;
app.listen(PORT, () => {
  console.log('--------------------------------------------------');
  console.log(`🚀 TENDA CARE ENGINE: ACTIVE`);
  console.log(`📍 LOCAL PORT: ${PORT}`);
  console.log(`📂 STORAGE TARGET: ${STORAGE_PATH}`);
  console.log('--------------------------------------------------');
});