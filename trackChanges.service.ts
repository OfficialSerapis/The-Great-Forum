import { DocumentInstance, UserInstance } from '../models';

class TrackChangesService {
  private static instance: TrackChangesService;
  private constructor() {}

  public static getInstance(): TrackChangesService {
    if (!TrackChangesService.instance) {
      TrackChangesService.instance = new TrackChangesService();
    }
    return TrackChangesService.instance;
  }

  async trackChanges(
    documentId: number,
    userId: number,
    changes: any
  ): Promise<any> {
    try {
      const document = await DocumentInstance.findByPk(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      // Create change record
      const changeRecord = {
        documentId,
        userId,
        changes,
        timestamp: new Date(),
        type: 'edit'
      };

      // Save change record
      await document.addChangeRecord(changeRecord);
      return changeRecord;
    } catch (error) {
      throw new Error('Failed to track changes');
    }
  }

  async getChangeHistory(
    documentId: number,
    options: any = {}
  ): Promise<any[]> {
    try {
      const document = await DocumentInstance.findByPk(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      const changes = await document.getChangeRecords({
        limit: options.limit || 50,
        offset: options.offset || 0,
        order: [['timestamp', 'DESC']]
      });

      return changes;
    } catch (error) {
      throw new Error('Failed to get change history');
    }
  }

  async revertChanges(
    documentId: number,
    changeId: number
  ): Promise<any> {
    try {
      const document = await DocumentInstance.findByPk(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      const change = await document.getChangeRecord(changeId);
      if (!change) {
        throw new Error('Change not found');
      }

      // Revert document content
      const previousContent = this.revertContent(document.content, change.changes);
      document.content = previousContent;
      await document.save();

      return document;
    } catch (error) {
      throw new Error('Failed to revert changes');
    }
  }

  private revertContent(currentContent: string, changes: any): string {
    // Revert content based on changes
    let content = currentContent;
    changes.forEach((change: any) => {
      if (change.type === 'text') {
        content = this.revertTextChange(content, change);
      }
    });
    return content;
  }

  private revertTextChange(content: string, change: any): string {
    // Revert text change
    return content;
  }
}

export const trackChangesService = TrackChangesService.getInstance();
