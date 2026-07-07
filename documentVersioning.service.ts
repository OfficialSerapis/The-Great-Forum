import { DocumentInstance } from '../models/document.model';

class DocumentVersioningService {
  private static instance: DocumentVersioningService;
  private constructor() {}

  public static getInstance(): DocumentVersioningService {
    if (!DocumentVersioningService.instance) {
      DocumentVersioningService.instance = new DocumentVersioningService();
    }
    return DocumentVersioningService.instance;
  }

  async listDocumentVersions(
    documentId: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<any[]> {
    try {
      const versions = await DocumentInstance.findAll({
        where: { id: documentId },
        limit,
        offset,
        order: [['versionNumber', 'DESC']]
      });
      return versions;
    } catch (error) {
      throw new Error('Failed to list document versions');
    }
  }

  async getDocumentVersion(
    documentId: number,
    versionNumber: number
  ): Promise<any> {
    try {
      const version = await DocumentInstance.findOne({
        where: { id: documentId, versionNumber }
      });
      if (!version) {
        throw new Error('Version not found');
      }
      return version;
    } catch (error) {
      throw new Error('Failed to get document version');
    }
  }

  async compareVersions(
    documentId: number,
    version1: number,
    version2: number
  ): Promise<any> {
    try {
      const [v1, v2] = await Promise.all([
        this.getDocumentVersion(documentId, version1),
        this.getDocumentVersion(documentId, version2)
      ]);
      return this.generateDiff(v1, v2);
    } catch (error) {
      throw new Error('Failed to compare versions');
    }
  }

  async restoreVersion(
    documentId: number,
    versionNumber: number
  ): Promise<any> {
    try {
      const version = await this.getDocumentVersion(documentId, versionNumber);
      const current = await DocumentInstance.findByPk(documentId);
      
      if (!current) {
        throw new Error('Document not found');
      }

      current.content = version.content;
      current.versionNumber = version.versionNumber + 1;
      await current.save();
      return current;
    } catch (error) {
      throw new Error('Failed to restore version');
    }
  }

  private generateDiff(v1: any, v2: any): any {
    // Generate diff between two versions
    return {
      changes: [
        { type: 'content', old: v1.content, new: v2.content },
        { type: 'metadata', old: v1.metadata, new: v2.metadata }
      ],
      summary: {
        additions: 0,
        deletions: 0,
        changes: 0
      }
    };
  }
}

export const documentVersioningService = DocumentVersioningService.getInstance();
