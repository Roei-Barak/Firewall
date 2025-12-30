import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import {
  addIps,
  addUrls,
  addPorts,
  toggleUrl,
  toggleIp,
  togglePort,
  deleteIps,
  deleteUrls,
  deletePorts,
  getAllRules
} from '../services/firewallService.js';

const router: Router = Router();
// --- GET ---
router.get('/rules', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rules = await getAllRules();
    res.status(200).json(rules);
  } catch (err) {
    next(err);
  }
});

// --- POST (Create) ---
router.post('/ips', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { values, mode } = req.body;
    const result = await addIps(values, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/urls', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { values, mode } = req.body;
    const result = await addUrls(values, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/ports', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { values, mode } = req.body;
    const result = await addPorts(values, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// --- PUT (Toggle Active) ---
router.put('/ips', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids, active, mode } = req.body;
    const result = await toggleIp(ids, active, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.put('/urls', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids, active, mode } = req.body;
    const result = await toggleUrl(ids, active, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.put('/ports', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids, active, mode } = req.body;
    const result = await togglePort(ids, active, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// --- DELETE ---
router.delete('/ips', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { values, mode } = req.body;
    const result = await deleteIps(values, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/urls', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { values, mode } = req.body;
    const result = await deleteUrls(values, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/ports', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { values, mode } = req.body;
    const result = await deletePorts(values, mode);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;