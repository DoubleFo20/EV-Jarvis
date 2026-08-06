import { Router } from 'express';
import {
  checkDatabaseHealth,
  checkHealth,
  checkRoot,
} from '../controllers/health.controller';
import { asyncHandler } from '../utils/async-handler';

const router = Router();

router.get('/', checkRoot);
router.get('/health', checkHealth);
router.get('/health/db', asyncHandler(checkDatabaseHealth));
router.get('/healthz', checkHealth);
router.get('/readyz', checkHealth);

export default router;
