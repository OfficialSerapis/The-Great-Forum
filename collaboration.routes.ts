import express from 'express';
import { ensureAuthenticated } from '../server/middleware/auth';
import { CollaborationService } from '../server/services/collaborationService';
import { ChatMessage } from '../server/models/chat.model';
import { Document } from '../server/models/document.model';
import { User } from '../server/models/user.model';
import { EnhancedSession, EnhancedRequest } from '../types/request';
import { MessageData, ChatMessageData, WebSocketMessage, DocumentUpdateMessage, CursorPosition } from '../types/collaboration';
import { WebSocketServer } from 'ws';
import { Session } from 'express-session';
import { Request, Response } from 'express';

// Helper function to ensure user is authenticated
const ensureUser = (req: EnhancedRequest) => {
  if (!req.user) {
    throw new Error('User not authenticated');
  }
  return req.user;
};

export const collaborationRouter = express.Router();
export let wss: WebSocketServer | null = null;

// Initialize collaboration service
const collaborationService = CollaborationService.getInstance();

// WebSocket setup
export function setupWebSocket(server: any) {
  if (!wss) {
    wss = new WebSocketServer({ server });
  }

  if (!wss) {
    return;
  }

  wss.on('connection', (ws: any, req: express.Request) => {
    const session = req.session as EnhancedSession;
    if (!session.userId || !session.documentId) {
      ws.close();
      return;
    }

    const userId = session.userId;
    const sessionId = session.id;
    const documentId = session.documentId;

    collaborationService.addConnection(ws, userId, sessionId, documentId);

    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data) as WebSocketMessage;
        
        switch (message.type) {
          case 'chat':
            collaborationService.handleChatMessage(message.data as ChatMessageData, userId, sessionId);
            break;
          case 'cursor':
            collaborationService.handleCursorUpdate(message.data as CursorPosition, userId, sessionId);
            break;
          case 'documentUpdate':
            collaborationService.handleDocumentUpdate(message.data as DocumentUpdateMessage, userId, sessionId);
            break;
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        ws.close();
      }
    });

    ws.on('close', () => {
      collaborationService.removeConnection(ws, userId, sessionId);
    });
  });
}

// REST API endpoints
collaborationRouter.get('/documents/:documentId/messages', ensureAuthenticated, async (req: EnhancedRequest, res: Response) => {
  try {
    const { documentId } = req.params;
    const user = ensureUser(req);
    const messages = await ChatMessage.findAll({
      where: { documentId: parseInt(documentId) },
      order: [['createdAt', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

collaborationRouter.post('/messages', ensureAuthenticated, async (req: EnhancedRequest, res: Response) => {
  try {
    const { content, documentId } = req.body;
    const userId = req.session.userId;
    const sessionId = req.session.id;

    if (!content || !documentId || !userId || !sessionId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const message = await ChatMessage.create({
      content,
      senderId: userId,
      documentId: parseInt(documentId, 10),
      type: 'text'
    });

    // Broadcast message to all connected clients
    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'chat',
            data: message,
            userId,
            sessionId
          }));
        }
      });
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

collaborationRouter.delete('/messages/:messageId', ensureAuthenticated, async (req: EnhancedRequest, res: Response) => {
  try {
    const messageId = parseInt(req.params.messageId, 10);
    const userId = req.session.userId;
    const sessionId = req.session.id;

    if (isNaN(messageId) || !userId || !sessionId) {
      return res.status(400).json({ error: 'Missing or invalid parameters' });
    }

    const message = await ChatMessage.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.senderId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await message.destroy();

    // Broadcast message deletion to all connected clients
    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'messageDeleted',
            data: { messageId },
            userId,
            sessionId
          }));
        }
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default collaborationRouter;
