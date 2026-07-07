import express from "express";
import { Express } from "express";
import path from "path";

export function setupVite(app: Express, httpServer: any) {
  // In development, Vite is run as a separate dev server (handled by npm run dev in client)
  // This is a placeholder for Vite middleware integration if needed for SSR, HMR, etc.
}

export function serveStatic(app: Express) {
  // In production, serve the built client files
  app.use(express.static(path.join(__dirname, "../client/dist")));
}

export function log(message: string) {
  // Simple logging utility
  // eslint-disable-next-line no-console
  console.log(message);
}
