const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser")


app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routers/auth');
const profileRouter = require('./routers/profile')
const requestRouter = require('./routers/request');

app.use("/", authRouter); 




connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777");
    });
  })
  



