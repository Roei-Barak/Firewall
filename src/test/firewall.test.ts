import request from 'supertest';
import app from '../app.js';
import { db } from '../database.js';
import { firewallIps, firewallUrls, firewallPorts } from '../types/schema.js';

describe('Firewall API Integration Tests', () => {
  
  // מנקים את ה-DB לפני כל טסט
  beforeEach(async () => {
    await db.delete(firewallIps);
    await db.delete(firewallUrls);
    await db.delete(firewallPorts);
  });

  // --- בדיקות הוספה (POST) ---
  test('POST /api/firewall/ips should add new IPs', async () => {
    const response = await request(app)
      .post('/api/firewall/ips')
      .send({ mode: 'blacklist', values: ['1.1.1.1', '8.8.8.8'] });

    expect(response.status).toBe(200);
    const dbResult = await db.select().from(firewallIps);
    expect(dbResult).toHaveLength(2);
  });

  // --- בדיקות מחיקה (DELETE) ---
  test('DELETE /api/firewall/ips should remove IPs', async () => {
    // 1. קודם כל נכניס משהו כדי שיהיה מה למחוק
    await db.insert(firewallIps).values({ ip: '1.1.1.1', mode: 'blacklist' });

    // 2. נשלח בקשת מחיקה
    const response = await request(app)
      .delete('/api/firewall/ips')
      .send({ mode: 'blacklist', values: ['1.1.1.1'] });

    expect(response.status).toBe(200);

    // 3. נבדוק שה-DB ריק
    const dbResult = await db.select().from(firewallIps);
    expect(dbResult).toHaveLength(0);
  });

  test('PUT /api/firewall/ips should toggle active status', async () => {
    // 1. נכניס IP פעיל
    const insertedRows = await db.insert(firewallIps)
      .values({ ip: '5.5.5.5', mode: 'whitelist' })
      .returning(); 
      
    const newIp = insertedRows[0]; // לוקחים את הראשון

    // התיקון: שורה שבודקת שבאמת קיבלנו משהו (Guard Clause)
    // ברגע ש-TS רואה את השורה הזאת, הוא יודע שבהמשך newIp בטוח קיים
    if (!newIp) throw new Error('Test setup failed: No IP inserted');

    // 2. נשלח בקשה לכיבוי
    const response = await request(app)
      .put('/api/firewall/ips')
      .send({ 
        mode: 'whitelist', 
        ids: [newIp.id], // עכשיו זה בטוח לשימוש
        active: false 
      });

    expect(response.status).toBe(200);

    // 3. נבדוק ב-DB
    // השתמשנו ב-eq של Drizzle במקום ב-any המכוער, אבל גם הדרך הקודמת תעבוד עכשיו
    const dbResult = await db.select().from(firewallIps);
    
    // נמצא את ה-IP שלנו ברשימה (במקום לסנן ב-SQL, זה פשוט יותר לטסטים קטנים)
    const updatedIp = dbResult.find(row => row.id === newIp.id);
    
    expect(updatedIp?.active).toBe(false);
  });

  // --- בדיקות כלליות (GET) ---
  test('GET /api/firewall/rules should return correct structure', async () => {
    const response = await request(app).get('/api/firewall/rules');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('ips');
    expect(response.body).toHaveProperty('urls');
    expect(response.body).toHaveProperty('ports');
  });

});