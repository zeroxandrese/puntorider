import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketIOServer;

export const initSocketio = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🧠 Cliente conectado:", socket.id);

    //sala para viajes confirmados
    socket.on("confirm-trip", ({ tripId }) => {
      socket.join(tripId);
      console.log(`Usuario unido a la sala del viaje: ${tripId}`);

      //io.to(tripId).emit('trip-started', { message: 'El viaje ha comenzado' });
    });

    // Para comentarios
    socket.on('new-comment', ({ tripId, comment }) => {
      io.to(tripId).emit('new-comment', comment);
    });

    socket.on("join", (uid: string) => {
      socket.join(uid);
      console.log(`🔗 Usuario ${uid} se unió a su sala.`);
    });

    socket.on("disconnect", () => {
      console.log("👋 Cliente desconectado:", socket.id);
    });
  });
};

export const getSocketIO = (): SocketIOServer => {
  if (!io) throw new Error("Socket.IO no ha sido inicializado");
  return io;
};