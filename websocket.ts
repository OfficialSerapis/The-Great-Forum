import { Server } from 'socket.io';

export class WebSocketConfig {
  private static instance: WebSocketConfig;
  private io: Server;
  private constructor() {}

  public static getInstance(): WebSocketConfig {
    if (!WebSocketConfig.instance) {
      WebSocketConfig.instance = new WebSocketConfig();
    }
    return WebSocketConfig.instance;
  }

  initialize(server: any): void {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST']
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: any) => {
      console.log('Client connected:', socket.id);

      socket.on('join-document', (documentId: string) => {
        socket.join(documentId);
        console.log(`Client ${socket.id} joined document ${documentId}`);
      });

      socket.on('leave-document', (documentId: string) => {
        socket.leave(documentId);
        console.log(`Client ${socket.id} left document ${documentId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  emitToDocument(documentId: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(documentId).emit(event, data);
    }
  }

  emitToUser(userId: string, event: string, data: any): void {
    if (this.io) {
      this.io.emit(`user:${userId}:${event}`, data);
    }
  }
}

export const websocketConfig = WebSocketConfig.getInstance();
