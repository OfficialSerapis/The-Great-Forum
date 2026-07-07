import { z } from 'zod';

export const SupportTicketSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  category: z.enum(['BUG', 'FEATURE', 'QUESTION', 'OTHER']),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  assignedTo: z.string().nullable(),
  messages: z.array(z.object({
    id: z.string(),
    content: z.string(),
    userId: z.string(),
    createdAt: z.date(),
  })),
});

export type SupportTicket = z.infer<typeof SupportTicketSchema>;
