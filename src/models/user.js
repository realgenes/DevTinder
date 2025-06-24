const mongoose = require("mongoose");
const validator = require("validator")
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength:30,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    lowercase:true,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("invalid email address!: " + value);
      }
    },
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Gender data is not valid");
      }
    },
  },
  photoUrl: {
    type: String,
    default: "https://sipl.ind.in/wp-content/uploads/2022/07/dummy-user.png",
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("invalid photoURL"+ value)
      }
    }
  },
  about: {
    type: String,
    default: "This is default about",
  },
  skills: {
    type: [String],
  },
}, {
  timestamps:true,
});

module.exports = mongoose.model("User", userSchema);
