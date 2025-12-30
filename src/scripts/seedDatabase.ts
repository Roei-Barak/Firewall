import { db } from '../database.js';
import { firewallIps, firewallUrls, firewallPorts } from '../types/schema.js';
import logger from '../config/logger.js';

const seed = async () => {
  logger.info('🌱 Starting database seeding...');

  try {
    // 1. ניקוי נתונים ישנים (כדי שלא יהיו כפילויות)
    await db.delete(firewallIps);
    await db.delete(firewallUrls);
    await db.delete(firewallPorts);
    logger.info('🧹 Database cleared.');

    // 2. הכנסת כתובות IP
    await db.insert(firewallIps).values([
      { ip: '1.1.1.1', mode: 'whitelist' },
      { ip: '8.8.8.8', mode: 'whitelist' },
      { ip: '192.168.1.100', mode: 'blacklist' },
      { ip: '10.0.0.5', mode: 'blacklist' },
    ]);
    logger.info('✅ IPs inserted.');

    // 3. הכנסת כתובות URL
    await db.insert(firewallUrls).values([
      { url: 'google.com', mode: 'whitelist' },
      { url: 'malware-site.com', mode: 'blacklist' },
      { url: 'phishing.net', mode: 'blacklist' },
    ]);
    logger.info('✅ URLs inserted.');

    // 4. הכנסת פורטים
    await db.insert(firewallPorts).values([
      { port: 80, mode: 'whitelist' },
      { port: 443, mode: 'whitelist' },
      { port: 3306, mode: 'blacklist' },
      { port: 22, mode: 'blacklist' },
    ]);
    logger.info('✅ Ports inserted.');

    logger.info('🎉 Seeding completed successfully!');
    process.exit(0);

  } catch (err: any) {
    logger.error(`❌ Seeding failed: ${err.message}`);
    process.exit(1);
  }
};

seed();