// services/firewallService.ts
import pool from '../db.js';
const groupByMode = (rows: any[]) => {
  return rows.reduce((acc, row) => {
    // בדיקה שה-mode קיים (blacklist או whitelist) ודחיפה למערך המתאים
    if (acc[row.mode]) {
      acc[row.mode].push(row);
    }
    return acc;
  }, { blacklist: [], whitelist: [] }); // אתחול האובייקט
};
const validateMode = (mode: string): mode is 'blacklist' | 'whitelist' => {
  return ['blacklist', 'whitelist'].includes(mode);
};

const validateValues = (values: any[]): boolean => {
  return Array.isArray(values) && values.length > 0;
};

export const addIps = async (values: string[], mode: 'blacklist' | 'whitelist') => {
  console.log('Entering addIps', { values, mode });
  
  if (!validateValues(values)) {
    throw new Error('Values array is required and cannot be empty');
  }
  
  if (!validateMode(mode)) {
    throw new Error('Mode must be either blacklist or whitelist');
  }

  try {
    const placeholders = values.map((_, i) => `($${i + 1}, $${values.length + 1})`).join(',');
    const query = `INSERT INTO firewall_ips (ip, mode) VALUES ${placeholders}`;
    await pool.query(query, [...values, mode]);
    return { type: 'ip', mode, values, status: 'success' };
  } catch (err: any) {
    console.error('Database insert error (IPs):', err);
    throw new Error(`Failed to insert IPs: ${err.message}`);
  }
};

export const addUrls = async (values: string[], mode: 'blacklist' | 'whitelist') => {
  console.log('Entering addUrls', { values, mode });
  
  if (!validateValues(values)) {
    throw new Error('Values array is required and cannot be empty');
  }
  
  if (!validateMode(mode)) {
    throw new Error('Mode must be either blacklist or whitelist');
  }

  try {
    const placeholders = values.map((_, i) => `($${i + 1}, $${values.length + 1})`).join(',');
    const query = `INSERT INTO firewall_urls (url, mode) VALUES ${placeholders}`;
    await pool.query(query, [...values, mode]);
    return { type: 'url', mode, values, status: 'success' };
  } catch (err: any) {
    console.error('Database insert error (URLs):', err);
    throw new Error(`Failed to insert URLs: ${err.message}`);
  }
};

export const addPorts = async (values: number[], mode: 'blacklist' | 'whitelist') => {
  console.log('Entering addPorts', { values, mode });
  
  if (!validateValues(values)) {
    return { type: 'port', mode, values, status: 'nothing to insert' };
  }
  
  if (!validateMode(mode)) {
    throw new Error('Mode must be either blacklist or whitelist');
  }

  try {
    const placeholders = values.map((_, i) => `($${i + 1}, $${values.length + 1})`).join(',');
    const query = `INSERT INTO firewall_ports (port, mode) VALUES ${placeholders}`;
    await pool.query(query, [...values, mode]);
    return { type: 'port', mode, values, status: 'success' };
  } catch (err: any) {
    console.error('Database insert error (Ports):', err);
    throw new Error(`Failed to insert Ports: ${err.message}`);
  }
};

export const toggleUrl = async (ids: number[], active: boolean, mode: 'blacklist' | 'whitelist') => {
  console.log('Entering toggleUrl', { ids, active, mode });
  
  if (!validateValues(ids)) {
    throw new Error('IDs array is required and cannot be empty');
  }
  
  if (!validateMode(mode)) {
    throw new Error('Mode must be either blacklist or whitelist');
  }
  
  if (typeof active !== 'boolean') {
    throw new Error('Active must be a boolean value');
  }

  try {
    const query = `
      UPDATE firewall_urls
      SET active = $2
      WHERE id = ANY($1) AND mode = $3
      RETURNING id, url as value, active
    `;
    const result = await pool.query(query, [ids, active, mode]);
    return { type: 'url', mode, updated: result.rows };
  } catch (err: any) {
    console.error('Database update error (URLs):', err);
    throw new Error(`Failed to toggle URLs: ${err.message}`);
  }
};

export const toggleIp = async (ids: number[], active: boolean, mode: 'blacklist' | 'whitelist') => {
  console.log('Entering toggleIp', { ids, active, mode });
  
  if (!validateValues(ids)) {
    throw new Error('IDs array is required and cannot be empty');
  }
  
  if (!validateMode(mode)) {
    throw new Error('Mode must be either blacklist or whitelist');
  }
  
  if (typeof active !== 'boolean') {
    throw new Error('Active must be a boolean value');
  }

  try {
    const query = `
      UPDATE firewall_ips
      SET active = $2
      WHERE id = ANY($1) AND mode = $3
      RETURNING id, ip as value, active
    `;
    const result = await pool.query(query, [ids, active, mode]);
    return { type: 'ip', mode, updated: result.rows };
  } catch (err: any) {
    console.error('Database update error (IPs):', err);
    throw new Error(`Failed to toggle IPs: ${err.message}`);
  }
};

export const togglePort = async (ids: number[], active: boolean, mode: 'blacklist' | 'whitelist') => {
  console.log('Entering togglePort', { ids, active, mode });
  
  if (!validateValues(ids)) {
    throw new Error('IDs array is required and cannot be empty');
  }
  
  if (!validateMode(mode)) {
    throw new Error('Mode must be either blacklist or whitelist');
  }
  
  if (typeof active !== 'boolean') {
    throw new Error('Active must be a boolean value');
  }

  try {
    const query = `
      UPDATE firewall_ports
      SET active = $2
      WHERE id = ANY($1) AND mode = $3
      RETURNING id, port as value, active
    `;
    const result = await pool.query(query, [ids, active, mode]);
    return { type: 'port', mode, updated: result.rows };
  } catch (err: any) {
    console.error('Database update error (ports):', err);
    throw new Error(`Failed to toggle ports: ${err.message}`);
  }
};

export const deleteIps = async (values: string[], mode: 'blacklist' | 'whitelist') => {
  console.log('Entering deleteIps', { values, mode });
  
  if (!validateValues(values)) {
    throw new Error('Values array is required and cannot be empty');
  }
  
  if (!validateMode(mode)) {
    throw new Error('Mode must be either blacklist or whitelist');
  }

  try {
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `DELETE FROM firewall_ips WHERE ip IN (${placeholders}) AND mode = $${values.length + 1}`;
    await pool.query(query, [...values, mode]);
    return { type: 'ip', mode, values, status: 'success' };
  } catch (err: any) {
    console.error('Database delete error (IPs):', err);
    throw new Error(`Failed to delete IPs: ${err.message}`);
  }
};

export const deleteUrls = async (values: string[], mode: 'blacklist' | 'whitelist') => {
  console.log('Entering deleteUrls', { values, mode });
  
  if (!validateValues(values)) {
    throw new Error('Values array is required and cannot be empty');
  }
  
  if (!validateMode(mode)) {
    throw new Error('Mode must be either blacklist or whitelist');
  }

  try {
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `DELETE FROM firewall_urls WHERE url IN (${placeholders}) AND mode = $${values.length + 1}`;
    await pool.query(query, [...values, mode]);
    return { type: 'url', mode, values, status: 'success' };
  } catch (err: any) {
    console.error('Database delete error (URLs):', err);
    throw new Error(`Failed to delete URLs: ${err.message}`);
  }
};

export const deletePorts = async (values: number[], mode: 'blacklist' | 'whitelist') => {
  console.log('Entering deletePorts', { values, mode });
  
  if (!validateValues(values)) {
    throw new Error('Values array is required and cannot be empty');
  }
  
  if (!validateMode(mode)) {
    throw new Error('Mode must be either blacklist or whitelist');
  }

  try {
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `DELETE FROM firewall_ports WHERE port IN (${placeholders}) AND mode = $${values.length + 1}`;
    await pool.query(query, [...values, mode]);
    return { type: 'port', mode, values, status: 'success' };
  } catch (err: any) {
    console.error('Database delete error (Ports):', err);
    throw new Error(`Failed to delete Ports: ${err.message}`);
  }
};

export const getAllRules = async () => {
  console.log('Entering getAllRules');
  
  try {
    const ipsResult = await pool.query('SELECT * FROM firewall_ips ORDER BY id');
    const urlsResult = await pool.query('SELECT * FROM firewall_urls ORDER BY id');
    const portsResult = await pool.query('SELECT * FROM firewall_ports ORDER BY id');
    
    return {
      ips: groupByMode(ipsResult.rows),
      urls: groupByMode(urlsResult.rows),
      ports: groupByMode(portsResult.rows)
    };
  } catch (err: any) {
    console.error('Database fetch error (All Rules):', err);
    throw new Error(`Failed to fetch all rules: ${err.message}`);
  }
};