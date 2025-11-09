const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);

    mongoose.connection.on("connected", () => {
      console.log("Database connection established...");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Database connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Database disconnected");
    });
  } catch (err) {
    console.error("Failed to connect to the database", err);
    process.exit(1); // Exit if initial connection fails
  }
};

module.exports = connectDB;
