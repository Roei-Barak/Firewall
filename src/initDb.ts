import pool from './db.js';

const createTables = async () => {
  const query = `
    -- יצירת טבלת IPs
    CREATE TABLE IF NOT EXISTS firewall_ips (
      id SERIAL PRIMARY KEY,
      ip VARCHAR(255) NOT NULL,
      mode VARCHAR(20) NOT NULL CHECK (mode IN ('blacklist', 'whitelist')),
      active BOOLEAN DEFAULT TRUE
    );

    -- יצירת טבלת URLs
    CREATE TABLE IF NOT EXISTS firewall_urls (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL,
      mode VARCHAR(20) NOT NULL CHECK (mode IN ('blacklist', 'whitelist')),
      active BOOLEAN DEFAULT TRUE
    );

    -- יצירת טבלת Ports
    CREATE TABLE IF NOT EXISTS firewall_ports (
      id SERIAL PRIMARY KEY,
      port INTEGER NOT NULL,
      mode VARCHAR(20) NOT NULL CHECK (mode IN ('blacklist', 'whitelist')),
      active BOOLEAN DEFAULT TRUE
    );
  `;

  try {
    console.log('Starting table creation...');
    await pool.query(query);
    console.log('All tables created successfully! 🚀');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    await pool.end(); // סגירת החיבור בסיום
  }
};

createTables();