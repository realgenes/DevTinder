require("dotenv").config();
const express = require("express");
const http = require("http");
const connectDB = require("./config/database");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const initializeSocket = require("./socket");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://devfronten.netlify.app/"],
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

// realgenes/devtinder/DevTinder-ed867288b6e5ddfd25f2561d79262b2c287c1260/Backend/src/app.js
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-netlify-app-name.netlify.app"], // Add your Netlify URL here later
    credentials: true,
  })
);

mongoose.set("debug", true);

const server = http.createServer(app);
const io = initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(7777, () => {
      console.log("Server is listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
