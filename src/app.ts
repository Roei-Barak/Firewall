import Express from 'express';
import pool from './db.js';

export const app = Express();

app.use(Express.json());

interface FirewallRequest {
    values: (string | number)[];           
    mode: 'blacklist' | 'whitelist'; 
}

// --- IPs Endpoints ---

app.post('/api/firewall/ip', async (req, res) => {
    const { values, mode } = req.body as FirewallRequest;
    console.log(`--- Adding IPs to ${mode} ---`);

    try {
        // פיצול המערך לשאילתות נפרדות
        await Promise.all(values.map(val => 
            pool.query('INSERT INTO ips(value, mode) VALUES ($1, $2) ON CONFLICT DO NOTHING', [val, mode])
        ));

        values.forEach(ip => console.log(`- ${ip}`));
        res.status(200).json({ type: 'ip', mode, values, status: 'success' });
    } catch (error) {
        console.error('Database insertion error:', error);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

app.delete('/api/firewall/ip', async (req, res) => {
    const { values, mode } = req.body as FirewallRequest;
    console.log(`--- Deleting IPs from ${mode} ---`);

    try {
        await pool.query('DELETE FROM ips WHERE value = ANY($1::text[]) AND mode = $2', [values, mode]);

        values.forEach(ip => console.log(`- ${ip}`));
        res.status(200).json({ type: 'ip', mode, values, status: 'success' });
    } catch (error) {
        console.error('Database deletion error:', error);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

// --- URLs Endpoints ---

app.post('/api/firewall/url', async (req, res) => {
    const { values, mode } = req.body as FirewallRequest;
    console.log(`--- Adding URLs to ${mode} ---`);

    try {
        await Promise.all(values.map(val => 
            pool.query('INSERT INTO urls(value, mode) VALUES ($1, $2) ON CONFLICT DO NOTHING', [val, mode])
        ));

        values.forEach(url => console.log(`- ${url}`));
        res.status(200).json({ type: 'url', mode, values, status: 'success' });
    } catch (error) {
        console.error('Database insertion error:', error);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

app.delete('/api/firewall/url', async (req, res) => {
    const { values, mode } = req.body as FirewallRequest;
    console.log(`--- Deleting URLs from ${mode} ---`);

    try {
        await pool.query('DELETE FROM urls WHERE value = ANY($1::text[]) AND mode = $2', [values, mode]);

        values.forEach(url => console.log(`- ${url}`));
        res.status(200).json({ type: 'url', mode, values, status: 'success' });
    } catch (error) {
        console.error('Database deletion error:', error);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

// --- Ports Endpoints ---

app.post('/api/firewall/port', async (req, res) => {
    const { values, mode } = req.body as FirewallRequest;
    console.log(`--- Adding Ports to ${mode} ---`);

    try {
        await Promise.all(values.map(val => 
            pool.query('INSERT INTO ports(value, mode) VALUES ($1, $2) ON CONFLICT DO NOTHING', [val, mode])
        ));

        values.forEach(port => console.log(`- ${port}`));
        res.status(200).json({ type: 'port', mode, values, status: 'success' });
    } catch (error) {
        console.error('Database insertion error:', error);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

app.delete('/api/firewall/port', async (req, res) => {
    const { values, mode } = req.body as FirewallRequest;
    console.log(`--- Deleting Ports from ${mode} ---`);

    try {
        await pool.query('DELETE FROM ports WHERE value = ANY($1::int[]) AND mode = $2', [values, mode]);

        values.forEach(port => console.log(`- ${port}`));
        res.status(200).json({ type: 'port', mode, values, status: 'success' });
    } catch (error) {
        console.error('Database deletion error:', error);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

// --- Get All Rules ---

const organizeRules = (items: any[]) => {
    return {

        blacklist: items
            .filter(item => item.mode === 'blacklist')
            .map(item => ({ id: item.id, value: item.value })),

        whitelist: items
            .filter(item => item.mode === 'whitelist')
            .map(item => ({ id: item.id, value: item.value }))
    };
};

app.get('/api/firewall/rules', async (req, res) => {
    console.log('--- Fetching All Firewall Rules ---');

    try {
        const [ipsResult, urlsResult, portsResult] = await Promise.all([
            pool.query("SELECT * FROM ips"),
            pool.query("SELECT * FROM urls"),
            pool.query("SELECT * FROM ports")
        ]);

        const responseData = {
            ips: organizeRules(ipsResult.rows),
            urls: organizeRules(urlsResult.rows),
            ports: organizeRules(portsResult.rows)
        };

        res.status(200).json(responseData);
        console.log('Fetched rules successfully'); 
        console.log(JSON.stringify(responseData, null, 2));

    } catch (error) {
        console.error('Error fetching rules:', error);
        res.status(500).send("Database error");
    }
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});