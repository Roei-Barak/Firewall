// scripts/testDrizzle.ts
import { db } from '../database.js'; // הייבוא החדש שיצרנו
import { firewallIps } from '../src/db/schema.js'; // הטבלה שהגדרנו

const testConnection = async () => {
  console.log('🔍 Testing Drizzle connection...');

  try {
    // שליפה פשוטה עם Drizzle (במקום SELECT * FROM...)
    const ips = await db.select().from(firewallIps).limit(5);
    
    console.log('✅ Success! Here are 5 IPs from the DB:');
    console.log(ips);
    
  } catch (err) {
    console.error('❌ Drizzle failed:', err);
  } finally {
    process.exit(0);
  }
};

testConnection();   