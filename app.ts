import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { Pool } from 'pg';
import PGStore from 'connect-pg-simple';
import { ensureAuthenticated } from './middleware/auth';
import { registerUser, loginUser, getProfile } from './controllers/userController';
import apiRouter from './routes/api';
import documentFeaturesRouter from './routes/documentFeatures.routes';
import advancedFeaturesRouter from './routes/advancedFeatures.routes';
import templateRouter from './routes/templates.routes';
import formattingRouter from './routes/formatting.routes';
import chatRoutes from './routes/chatRoutes';
import collaborationRoutes from './routes/collaboration.routes';
import documentAccessibilityRouter from './routes/documentAccessibility.routes';
import documentFormattingRouter from './routes/documentFormatting.routes';
import quantumConsciousnessRouter from './routes/quantumConsciousness.routes';
import advancedEditingRouter from './routes/advancedEditing.routes';
import permissionsRoutes from './routes/permissions.routes';
import aiSuggestionsRoutes from './routes/aiSuggestions.routes';
import platformIntegrationRoutes from './routes/platformIntegration.routes';
import aiServicesRoutes from './routes/aiServices.routes';
import accessibilityRoutes from './routes/accessibility.routes';

// Initialize PostgreSQL pool
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Create Express app
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: new PGStore({
    pool: pgPool,
    tableName: 'sessions'
  })
}));

// Routes
app.use('/api', apiRouter);
app.use('/api/documents', documentFeaturesRouter);
app.use('/api/advanced', advancedFeaturesRouter);
app.use('/api/templates', templateRouter);
app.use('/api/formatting', formattingRouter);
app.use('/api/chat', chatRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/documents', documentAccessibilityRouter);
app.use('/api/documents', documentFormattingRouter);
app.use('/api/quantum-consciousness', quantumConsciousnessRouter);
app.use('/api/advanced-editing', advancedEditingRouter);
app.use('/permissions', permissionsRoutes);
app.use('/ai-suggestions', aiSuggestionsRoutes);
app.use('/api/platform-integration', platformIntegrationRoutes);
app.use('/api/ai-services', aiServicesRoutes);
app.use('/accessibility', accessibilityRoutes);

// Public routes
app.post('/api/register', (req: Request, res: Response, next: NextFunction) => {
  registerUser(req, res, next);
});

app.post('/api/login', (req: Request, res: Response, next: NextFunction) => {
  loginUser(req, res, next);
});

// Protected routes
app.get('/api/profile', ensureAuthenticated, (req: Request, res: Response, next: NextFunction) => {
  getProfile(req, res, next);
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
