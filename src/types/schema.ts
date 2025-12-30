import { pgTable, serial, text, varchar, boolean, integer } from 'drizzle-orm/pg-core';

// הגדרת טבלת IPs
export const firewallIps = pgTable('firewall_ips', {
  id: serial('id').primaryKey(),
  ip: varchar('ip', { length: 255 }).notNull(),
  mode: varchar('mode', { length: 20 }).notNull(), // blacklist/whitelist
  active: boolean('active').default(true),
});

// הגדרת טבלת URLs
export const firewallUrls = pgTable('firewall_urls', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  mode: varchar('mode', { length: 20 }).notNull(),
  active: boolean('active').default(true),
});

// הגדרת טבלת Ports
export const firewallPorts = pgTable('firewall_ports', {
  id: serial('id').primaryKey(),
  port: integer('port').notNull(),
  mode: varchar('mode', { length: 20 }).notNull(),
  active: boolean('active').default(true),
});