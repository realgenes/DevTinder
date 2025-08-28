const express = require("express");
const connectDB = require("./config/database");
const app = express();
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser")
const cors = require("cors");


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routers/auth');
const profileRouter = require('./routers/profile')
const requestRouter = require('./routers/request');
const userRouter = require("./routers/user");

app.use("/", authRouter); 
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


mongoose.set("debug", true);


connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777");
    });
  })
  



