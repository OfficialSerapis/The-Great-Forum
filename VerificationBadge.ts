import { z } from 'zod';

export const VerificationBadgeSchema = z.object({
  isVerified: z.boolean(),
  customBadge: z.string().optional(),
  customEmoji: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type VerificationBadge = z.infer<typeof VerificationBadgeSchema>;

export const createVerificationBadge = (user: any): VerificationBadge => ({
  isVerified: false,
  customBadge: null,
  customEmoji: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
