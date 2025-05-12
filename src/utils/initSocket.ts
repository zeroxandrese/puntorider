import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketIOServer;
const userSockets = new Map<string, string>();

export const initSocketio = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    pingInterval: 120000,
    pingTimeout: 110000
  });

  io.on("connection", (socket) => {
    console.log("🧠 Cliente conectado:", socket.id);

    socket.on("register-user", (uid: string) => {
      userSockets.set(uid, socket.id);
      console.log(`Usuario ${uid} registrado en socket ${socket.id}`);
    });

    socket.on("confirm-trip", ({ tripId }) => {
      socket.join(tripId);
      console.log(`Usuario ${socket.id} unido a la sala del viaje: ${tripId}`);
    });

    socket.on("new-comment", ({ tripId, comment }) => {
      io.to(tripId).emit("new-comment", comment);
    });

    socket.on("join", (uid: string) => {
      socket.join(uid);
      console.log(`🔗 Usuario ${uid} se unió a su sala.`);
    });

    // Desconexión
    socket.on("disconnect", () => {
      console.log("👋 Cliente desconectado:", socket.id);

      userSockets.forEach((id, uid) => {
        if (id === socket.id) {
          userSockets.delete(uid);
        }
      });
    });
  });
};

export const getSocketIO = (): SocketIOServer => {
  if (!io) throw new Error("Socket.IO no ha sido inicializado");
  return io;
};