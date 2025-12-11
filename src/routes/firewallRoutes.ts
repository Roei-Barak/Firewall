import { Router, Request, Response, NextFunction } from 'express';
import {
  addIps,
  addUrls,
  addPorts,
  toggleUrl,
  deleteIps,
  deleteUrls,
  deletePorts,
  getAllRules
} from '../services/firewallService';

const router = Router();

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
router.put('/url', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids, active, mode } = req.body;
    const result = await toggleUrl(ids, active, mode);
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

export default router;
