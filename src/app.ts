
import express from 'express';
import firewallRoutes from './routes/firewallRoutes.js';

const app = express();
app.use(express.json());

app.use('/api/firewall', firewallRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(process.env.PORT || 5000, () => console.log('Server running on http://localhost:5000'));