require("dotenv").config();
const express = require("express");
const http = require("http");
const connectDB = require("./config/database");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const initializeSocket = require("./socket");

const allowedOrigins = ["http://localhost:5173"];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/request");
const userRouter = require("./routers/user");
const chatRouter = require("./routers/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/chat", chatRouter);
app.use("/user", userRouter);

mongoose.set("debug", true);

const server = http.createServer(app);
const io = initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    const PORT = process.env.PORT || 7777;
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
