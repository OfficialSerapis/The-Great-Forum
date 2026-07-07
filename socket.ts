import { Server } from "http";
import { Server as IOServer } from "socket.io";

let io: IOServer | null = null;

export let httpServer: Server;

export function setupSocket(server: Server) {
  io = new IOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // Example: handle chat messages
    socket.on("chat:message", (msg) => {
      io?.emit("chat:message", msg);
    });

    // More real-time events can be handled here
  });
}

export function attachSocketToServer(server: Server) {
  setupSocket(server);
}
