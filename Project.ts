import { z } from 'zod';

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  ownerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  members: z.array(z.string()),
  status: z.enum(['PLANNING', 'DEVELOPMENT', 'TESTING', 'RELEASED']),
  repositoryUrl: z.string().url().nullable(),
  tags: z.array(z.string()),
  screenshots: z.array(z.string()),
  trailerUrl: z.string().url().nullable(),
  rating: z.number().min(0).max(5).nullable(),
  downloads: z.number().default(0),
  featured: z.boolean().default(false),
});

export type Project = z.infer<typeof ProjectSchema>;
