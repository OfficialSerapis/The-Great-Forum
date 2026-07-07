import { z } from 'zod';

export const TutorialSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  duration: z.number(),
  category: z.enum(['GETTING_STARTED', 'GRAPHICS', 'PHYSICS', 'AI', 'NETWORKING']),
  authorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isPublished: z.boolean(),
  prerequisites: z.array(z.string()),
  nextTutorialId: z.string().nullable(),
  previousTutorialId: z.string().nullable(),
});

export type Tutorial = z.infer<typeof TutorialSchema>;
