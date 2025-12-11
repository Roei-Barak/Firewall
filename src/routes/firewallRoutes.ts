import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import {
  addIps,
  addUrls,
  addPorts,
  toggleUrl,
  deleteIps,
  deleteUrls,
  deletePorts,
  toggleIp,
  togglePort,
  getAllRules
} from '../services/firewallService.js';

const router: Router = Router();

// POST IPs
router.post('/ip', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { values, mode } = req.body;
    const result = await addIps(values, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// POST URLs
router.post('/url', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { values, mode } = req.body;
    const result = await addUrls(values, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// POST Ports
router.post('/port', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { values, mode } = req.body;
    const result = await addPorts(values, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// PUT URL (toggle active)
router.patch('/url', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids, active, mode } = req.body;
    const result = await toggleUrl(ids, active, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});
router.patch('/ip', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids, active, mode } = req.body;
    // וודא שייבאת את toggleIp למעלה
    const result = await toggleIp(ids, active, mode); 
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});
router.patch('/port', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids, active, mode } = req.body;
    // וודא שייבאת את togglePort למעלה
    const result = await togglePort(ids, active, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});
// DELETE IPs
router.delete('/ip', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { values, mode } = req.body;
    const result = await deleteIps(values, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// DELETE URLs
router.delete('/url', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { values, mode } = req.body;
    const result = await deleteUrls(values, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// DELETE Ports
router.delete('/port', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { values, mode } = req.body;
    const result = await deletePorts(values, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});


// GET all rules
router.get('/rules', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllRules();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});
router.put('/rules', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ips, urls, ports } = req.body;
    let allUpdated: any[] = [];

    // 1. Handle IPs
    if (ips && ips.ids && ips.ids.length > 0) {
      const result = await toggleIp(ips.ids, ips.active, ips.mode);
      if (result.updated) {
        allUpdated = allUpdated.concat(result.updated.map(item => ({
          id: item.id,
          value: item.value,
          active: item.active,
          type: 'ip'
        })));
      }
    }

    // 2. Handle URLs
    if (urls && urls.ids && urls.ids.length > 0) {
      const result = await toggleUrl(urls.ids, urls.active, urls.mode);
      if (result.updated) {
        allUpdated = allUpdated.concat(result.updated.map(item => ({
          id: item.id,
          value: item.value,
          active: item.active,
          type: 'url'
        })));
      }
    }

    // 3. Handle Ports
    if (ports && ports.ids && ports.ids.length > 0) {
      const result = await togglePort(ports.ids, ports.active, ports.mode);
      if (result.updated) {
        allUpdated = allUpdated.concat(result.updated.map(item => ({
          id: item.id,
          value: item.value,
          active: item.active,
          type: 'port'
        })));
      }
    }

    // Return the combined result
    res.status(200).json({ updated: allUpdated });

  } catch (err) {
    next(err);
  }
});
export default router;
