import { db } from '../database.js';
import { firewallIps, firewallUrls, firewallPorts } from '../types/schema.js';
import { eq, inArray, and } from 'drizzle-orm';

// --- Helper Functions ---

const validateMode = (mode: string): mode is 'blacklist' | 'whitelist' => {
  return ['blacklist', 'whitelist'].includes(mode);
};

const validateValues = (values: any[]): boolean => {
  return Array.isArray(values) && values.length > 0;
};

const groupByMode = (rows: any[]) => {
  return rows.reduce((acc, row) => {
    if (acc[row.mode]) {
      acc[row.mode].push(row);
    }
    return acc;
  }, { blacklist: [], whitelist: [] });
};

// --- Services ---

export const addIps = async (values: string[], mode: 'blacklist' | 'whitelist') => {
  console.log('Entering addIps (Drizzle)', { values, mode });
  
  if (!validateValues(values)) throw new Error('Values array is required');
  if (!validateMode(mode)) throw new Error('Mode must be either blacklist or whitelist');

  try {
    // המרת רשימת מחרוזות לרשימת אובייקטים להכנסה
    const valuesToInsert = values.map(ip => ({ ip, mode }));
    
    // SQL: INSERT INTO firewall_ips ...
    await db.insert(firewallIps).values(valuesToInsert);
    
    return { type: 'ip', mode, values, status: 'success' };
  } catch (err: any) {
    throw new Error(`Failed to insert IPs: ${err.message}`);
  }
};

export const addUrls = async (values: string[], mode: 'blacklist' | 'whitelist') => {
  if (!validateValues(values)) throw new Error('Values array is required');
  if (!validateMode(mode)) throw new Error('Mode must be either blacklist or whitelist');

  try {
    const valuesToInsert = values.map(url => ({ url, mode }));
    
    await db.insert(firewallUrls).values(valuesToInsert);
    
    return { type: 'url', mode, values, status: 'success' };
  } catch (err: any) {
    throw new Error(`Failed to insert URLs: ${err.message}`);
  }
};

export const addPorts = async (values: number[], mode: 'blacklist' | 'whitelist') => {
  if (!validateValues(values)) return { type: 'port', mode, values, status: 'nothing to insert' };
  if (!validateMode(mode)) throw new Error('Mode must be either blacklist or whitelist');

  try {
    const valuesToInsert = values.map(port => ({ port, mode }));
    
    await db.insert(firewallPorts).values(valuesToInsert);
    
    return { type: 'port', mode, values, status: 'success' };
  } catch (err: any) {
    throw new Error(`Failed to insert Ports: ${err.message}`);
  }
};

export const toggleUrl = async (ids: number[], active: boolean, mode: 'blacklist' | 'whitelist') => {
  if (!validateValues(ids)) throw new Error('IDs array is required');
  if (!validateMode(mode)) throw new Error('Invalid mode');

  try {
    // SQL: UPDATE firewall_urls SET active = $2 WHERE id IN ($1) AND mode = $3 RETURNING ...
    const result = await db
      .update(firewallUrls)
      .set({ active })
      .where(and(inArray(firewallUrls.id, ids), eq(firewallUrls.mode, mode)))
      .returning({ id: firewallUrls.id, value: firewallUrls.url, active: firewallUrls.active });

    return { type: 'url', mode, updated: result };
  } catch (err: any) {
    throw new Error(`Failed to toggle URLs: ${err.message}`);
  }
};

export const toggleIp = async (ids: number[], active: boolean, mode: 'blacklist' | 'whitelist') => {
  if (!validateValues(ids)) throw new Error('IDs array is required');
  if (!validateMode(mode)) throw new Error('Invalid mode');

  try {
    const result = await db
      .update(firewallIps)
      .set({ active })
      .where(and(inArray(firewallIps.id, ids), eq(firewallIps.mode, mode)))
      .returning({ id: firewallIps.id, value: firewallIps.ip, active: firewallIps.active });

    return { type: 'ip', mode, updated: result };
  } catch (err: any) {
    throw new Error(`Failed to toggle IPs: ${err.message}`);
  }
};

export const togglePort = async (ids: number[], active: boolean, mode: 'blacklist' | 'whitelist') => {
  if (!validateValues(ids)) throw new Error('IDs array is required');
  if (!validateMode(mode)) throw new Error('Invalid mode');

  try {
    const result = await db
      .update(firewallPorts)
      .set({ active })
      .where(and(inArray(firewallPorts.id, ids), eq(firewallPorts.mode, mode)))
      .returning({ id: firewallPorts.id, value: firewallPorts.port, active: firewallPorts.active });

    return { type: 'port', mode, updated: result };
  } catch (err: any) {
    throw new Error(`Failed to toggle Ports: ${err.message}`);
  }
};

export const deleteIps = async (values: string[], mode: 'blacklist' | 'whitelist') => {
  if (!validateValues(values)) throw new Error('Values required');
  if (!validateMode(mode)) throw new Error('Invalid mode');

  try {
    // SQL: DELETE FROM firewall_ips WHERE ip IN (...) AND mode = ...
    await db
      .delete(firewallIps)
      .where(and(inArray(firewallIps.ip, values), eq(firewallIps.mode, mode)));
      
    return { type: 'ip', mode, values, status: 'success' };
  } catch (err: any) {
    throw new Error(`Failed to delete IPs: ${err.message}`);
  }
};

export const deleteUrls = async (values: string[], mode: 'blacklist' | 'whitelist') => {
  if (!validateValues(values)) throw new Error('Values required');
  if (!validateMode(mode)) throw new Error('Invalid mode');

  try {
    await db
      .delete(firewallUrls)
      .where(and(inArray(firewallUrls.url, values), eq(firewallUrls.mode, mode)));

    return { type: 'url', mode, values, status: 'success' };
  } catch (err: any) {
    throw new Error(`Failed to delete URLs: ${err.message}`);
  }
};

export const deletePorts = async (values: number[], mode: 'blacklist' | 'whitelist') => {
  if (!validateValues(values)) throw new Error('Values required');
  if (!validateMode(mode)) throw new Error('Invalid mode');

  try {
    await db
      .delete(firewallPorts)
      .where(and(inArray(firewallPorts.port, values), eq(firewallPorts.mode, mode)));

    return { type: 'port', mode, values, status: 'success' };
  } catch (err: any) {
    throw new Error(`Failed to delete Ports: ${err.message}`);
  }
};

export const getAllRules = async () => {
  try {
    // SQL: SELECT * FROM firewall_ips ORDER BY id
    const ipsResult = await db.select().from(firewallIps).orderBy(firewallIps.id);
    const urlsResult = await db.select().from(firewallUrls).orderBy(firewallUrls.id);
    const portsResult = await db.select().from(firewallPorts).orderBy(firewallPorts.id);
    
    return {
      ips: groupByMode(ipsResult),
      urls: groupByMode(urlsResult),
      ports: groupByMode(portsResult)
    };
  } catch (err: any) {
    throw new Error(`Failed to fetch all rules: ${err.message}`);
  }
};