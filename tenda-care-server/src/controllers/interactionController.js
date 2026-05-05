import { supabase } from '../config/supabase.js';
import fs from 'fs';
import path from 'path';

export const logInteraction = async (req, res) => {
    const { userId, actionType, metadata, heavyData } = req.body;
    const storagePath = process.env.LOCAL_DATA_DIR || './tenda_storage';

    try {
        // A. Send small data to Supabase Cloud
        const { error: dbError } = await supabase
            .from('interactions')
            .insert([{ user_id: userId, action_type: actionType, metadata: metadata }]);

        if (dbError) throw dbError;

        // B. Save heavy data to your 1TB Local Drive
        if (heavyData) {
            // Ensure folder exists
            if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);

            const fileName = `user_${userId}_${Date.now()}.json`;
            const filePath = path.join(storagePath, fileName);
            
            fs.writeFileSync(filePath, JSON.stringify(heavyData, null, 2));
            console.log(`💾 Data saved locally: ${fileName}`);
        }

        res.status(200).json({ success: true, message: "Synchronized to Cloud & Local Disk" });

    } catch (error) {
        console.error("Critical Error:", error.message);
        res.status(500).json({ error: error.message });
    }

};