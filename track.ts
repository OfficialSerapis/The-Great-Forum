export interface TrackChange {
  id: string;
  documentId: number;
  userId: number;
  operation: string;
  content: string;
  timestamp: Date;
}

export const createTrackChange = (documentId: number, userId: number, operation: string, content: string): TrackChange => ({
  id: generateId(),
  documentId,
  userId,
  operation,
  content,
  timestamp: new Date()
});
