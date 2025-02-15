let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Utilisateur connecté :", socket.id);

    socket.on("disconnect", () => {
      console.log("Utilisateur déconnecté :", socket.id);
    });
  });
};

const sendNotification = (message) => {
  if (io) {
    io.emit("notification", message);
  } else {
    console.error("Socket.io non initialisé");
  }
};

module.exports = { initSocket, sendNotification };
