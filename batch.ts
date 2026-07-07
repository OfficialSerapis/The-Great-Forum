export interface BatchOperation {
  id: string;
  documentId: number;
  operations: Array<{
    type: string;
    content: string;
    position: number;
  }>;
  userId: number;
  timestamp: Date;
}

export const createBatchOperation = (documentId: number, operations: BatchOperation['operations'], userId: number): BatchOperation => ({
  id: generateId(),
  documentId,
  operations,
  userId,
  timestamp: new Date()
});
