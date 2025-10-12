const { Server } = require("socket.io");
const Message = require("./models/message");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://devfronten.netlify.app"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
      try {
        const newMessage = new Message({
          senderId,
          receiverId,
          message,
        });

        await newMessage.save();

        // Emit to receiver's room
        io.to(receiverId).emit("receiveMessage", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("messageError", { error: "Failed to send message" });
      }
    });

    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initializeSocket;
