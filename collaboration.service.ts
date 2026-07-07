import { DocumentInstance, UserInstance } from '../models';

class CollaborationService {
  private static instance: CollaborationService;
  private constructor() {}

  public static getInstance(): CollaborationService {
    if (!CollaborationService.instance) {
      CollaborationService.instance = new CollaborationService();
    }
    return CollaborationService.instance;
  }

  async addCollaborator(
    documentId: number,
    userId: number,
    permissions: any
  ): Promise<any> {
    try {
      const document = await DocumentInstance.findByPk(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      const user = await UserInstance.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Validate permissions
      this.validatePermissions(permissions);

      // Add collaboration record
      const collaboration = {
        documentId,
        userId,
        permissions,
        joinedAt: new Date(),
        lastActive: new Date()
      };

      await document.addCollaborator(user, collaboration);
      return collaboration;
    } catch (error) {
      throw new Error('Failed to add collaborator');
    }
  }

  async removeCollaborator(
    documentId: number,
    userId: number
  ): Promise<void> {
    try {
      const document = await DocumentInstance.findByPk(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      const user = await UserInstance.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await document.removeCollaborator(user);
    } catch (error) {
      throw new Error('Failed to remove collaborator');
    }
  }

  async getCollaborators(
    documentId: number
  ): Promise<any[]> {
    try {
      const document = await DocumentInstance.findByPk(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      const collaborators = await document.getCollaborators();
      return collaborators;
    } catch (error) {
      throw new Error('Failed to get collaborators');
    }
  }

  async broadcastChange(
    documentId: number,
    change: any
  ): Promise<void> {
    try {
      const document = await DocumentInstance.findByPk(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      const collaborators = await this.getCollaborators(documentId);
      collaborators.forEach(collaborator => {
        this.sendChangeToCollaborator(collaborator, change);
      });
    } catch (error) {
      throw new Error('Failed to broadcast change');
    }
  }

  private validatePermissions(permissions: any): void {
    // Validate permissions structure
    const requiredPermissions = ['read', 'write', 'edit', 'share'];
    requiredPermissions.forEach(permission => {
      if (typeof permissions[permission] !== 'boolean') {
        throw new Error(`Invalid permission: ${permission}`);
      }
    });
  }

  private async sendChangeToCollaborator(
    collaborator: any,
    change: any
  ): Promise<void> {
    try {
      const socket = await this.getWebSocketConnection(collaborator.userId);
      if (socket) {
        socket.send(JSON.stringify({
          type: 'change',
          data: change
        }));
      }
    } catch (error) {
      throw new Error('Failed to send change to collaborator');
    }
  }

  private async getWebSocketConnection(userId: number): Promise<any> {
    // Get WebSocket connection for user
    return null;
  }
}

export const collaborationService = CollaborationService.getInstance();
