const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://itsshishupal:t3874KX6Q7xvEoSP@nodejs-learning.jfqcbli.mongodb.net/devTinder"
  );
};

module.exports = connectDB;


