const { Server } = require("socket.io");
const Message = require("./models/message");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
      const newMessage = new Message({
        senderId,
        receiverId,
        message,
      });

      await newMessage.save();

      io.to(receiverId).emit("receiveMessage", newMessage);
    });

    socket.on("joinRoom", (userId) => {
      socket.join(userId);
    });

    socket.on("disconnect", () => {
    });
  });

  return io;
};

module.exports = initializeSocket;
