import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken as verifyClientToken } from "../helpers/generate-jwt";
import { verifyToken as verifyDriverToken } from "../helpers/generate-jwt-driver";

let io: SocketIOServer;
const userSockets = new Map<string, string>();
const PING_INTERVAL = 25000;

export const initSocketio = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    pingInterval: PING_INTERVAL,
    pingTimeout: 60000
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next();
    }

    const user = await verifyClientToken(token);
    const driver = user ? null : await verifyDriverToken(token);
    const authUser = user || driver;

    if (!authUser) {
      (socket as any).authFailed = true;
      return next();
    }

    socket.data.userId = authUser.uid;
    return next();
  });

  io.on("connection", (socket: Socket) => {
    if ((socket as any).authFailed || !socket.data.userId) {
      socket.emit("auth_error", { message: "Token inválido" });
      return socket.disconnect();
    }

    const uid = socket.data.userId as string;
    userSockets.set(uid, socket.id);
    socket.join(uid);
    console.log("🧠 Cliente conectado:", socket.id, "usuario", uid);

    const ping = setInterval(() => {
      socket.emit("ping");
    }, PING_INTERVAL);

    socket.on("register-user", (customUid: string) => {
      userSockets.set(customUid, socket.id);
      socket.join(customUid);
    });

    socket.on("confirm-trip", ({ tripId }) => {
      socket.join(tripId);
      console.log(`Usuario ${socket.id} unido a la sala del viaje: ${tripId}`);
    });

    socket.on("new-comment", ({ tripId, comment }) => {
      io.to(tripId).emit("new-comment", comment);
    });

    socket.on("join", (roomId: string) => {
      socket.join(roomId);
      console.log(`🔗 Usuario ${uid} se unió a la sala ${roomId}.`);
    });

    socket.on("disconnect", () => {
      clearInterval(ping);
      console.log("👋 Cliente desconectado:", socket.id);

      userSockets.forEach((id, storedUid) => {
        if (id === socket.id) {
          userSockets.delete(storedUid);
        }
      });
    });
  });
};

export const getSocketIO = (): SocketIOServer => {
  if (!io) throw new Error("Socket.IO no ha sido inicializado");
  return io;
};