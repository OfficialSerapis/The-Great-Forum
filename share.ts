import { z } from 'zod';

export const insertShareSchema = z.object({
  userId: z.number(),
  documentId: z.number(),
  sharedWithUserId: z.number(),
  permissions: z.object({
    canEdit: z.boolean(),
    canComment: z.boolean(),
    canShare: z.boolean(),
  }),
});

export const insertFollowSchema = z.object({
  userId: z.number(),
  followingUserId: z.number(),
});
