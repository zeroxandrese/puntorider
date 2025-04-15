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

    socket.on("message", (data) => {
      console.log("📩 Mensaje recibido:", data);
      io.emit("message", data);
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