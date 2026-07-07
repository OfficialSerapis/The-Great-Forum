import express from 'express';
import { ensureAuthenticated } from '../middleware/auth';

const router = express.Router();

router.post('/', ensureAuthenticated, (req, res) => {
  // Implementation
});

router.put('/:id', ensureAuthenticated, (req, res) => {
  // Implementation
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
  // Implementation
});

export default router;
