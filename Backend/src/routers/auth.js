const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //validate data
    validateSignUpData(req);

    const { password, firstName, lastName, emailId, skills, age, gender } =
      req.body;

    //encrypting password
    const passwordHash = await bcrypt.hash(password, 10);

    //creating new instance
    const user = new User({
      firstName,
      lastName,
      skills,
      gender,
      age,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    //add token to cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error("emailId and password are required!");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credintials!");
    }

    if (!user.password) {
      throw new Error("User password not set in DB");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //create a jwt token
      const token = await user.getJWT();
      //add token to cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.send(user);
    } else {
      throw new Error("password is not valid !");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 0,
  });
  res.send("Logout Successfully !");
});

module.exports = authRouter;
