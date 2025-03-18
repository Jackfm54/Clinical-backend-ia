const io = require("socket.io");

let socketServer;

const initSocket = (server) => {
  socketServer = io(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  socketServer.on("connection", (socket) => {
    console.log(`🟢 Nueva conexión: ${socket.id}`);

    socket.on("joinRoom", (doctorId) => {
      console.log(`🛑 El doctor ${doctorId} se une a la sala de notificaciones`);
      socket.join(doctorId);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Usuario desconectado");
    });
  });
};

const sendNotification = ({ userId, message }) => {
  if (socketServer) {
    console.log(`📢 Enviando notificación a ${userId}: ${message}`);
    socketServer.to(userId).emit("notification", message);
  } else {
    console.error("⚠ No hay conexión con WebSocket.");
  }
};

module.exports = { initSocket, sendNotification };
