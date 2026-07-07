import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import express, { Request as ExpressRequest, Response, NextFunction } from 'express';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { Session, SessionData } from 'express-session';
import bcrypt from 'bcryptjs';
import { storage } from "./storage";
import { User } from "@shared/schema";

// Extend Express types to include session and user
declare global {
  namespace Express {
    interface Request extends ExpressRequest {
      user?: User;
      login?: {
        (user: User, done: (err: any) => void): void;
        (user: User, options: express.SessionOptions, done: (err: any) => void): void;
      };
      logout?: {
        (options: express.SessionOptions, done: (err: any) => void): void;
        (done: (err: any) => void): void;
      };
      isAuthenticated?: () => boolean;
      body: Record<string, any>;
      params: Record<string, string>;
      session: Session & Partial<SessionData>;
    }
  }

  interface AuthenticatedRequest extends Request {
    user: User;
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: express.Application) {
  // Add session store to storage
  storage.sessionStore = {
    get: async (id: string) => {
      const session = await storage.getSession(id);
      return session ? JSON.parse(session.data) : null;
    },
    set: async (id: string, session: SessionData) => {
      await storage.setSession(id, JSON.stringify(session));
    },
    destroy: async (id: string) => {
      await storage.destroySession(id);
    }
  };

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: User, done: (err: any, id?: number) => void) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done: (err: any, user?: User) => void) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username: string, password: string, done: (err: any, user?: User) => void) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      const isValid = await comparePasswords(password, user.password);
      if (!isValid) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'great-forum-dev-secret',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username: string, password: string, done: (err: Error | null, user?: User, info?: any) => void) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Invalid username or password' });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: 'Invalid username or password' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user: User, done: (err: Error | null, id?: number) => void) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done: (err: Error | null, user?: User) => void) => {
    try {
      const user = await storage.getUserById(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, name } = req.body;
      
      if (!username || !password || !name) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        id: Date.now(),
        username,
        password: hashedPassword,
        name,
        email,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      req.login(user, (err: Error | null) => {
        if (err) return next(err);
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error as Error);
    }
  });

  app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error | null, user: User | false) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      req.login(user, (err: Error | null) => {
        if (err) {
          return next(err);
        }
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req: Request, res: Response, next: NextFunction) => {
    req.logout((err: Error | null) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send('Unauthorized');
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = req.user as User;
    res.json(userWithoutPassword);
  });
}
