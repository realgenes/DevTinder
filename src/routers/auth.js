const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const {validateSignUpData} = require('../utils/validation')
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

    await user.save();
    res.send("user added successfully!");
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error('emailId and password are required!');
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error('Invalid credintials!')
    }

    if (!user.password) {
      throw new Error('User password not set in DB');
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //create a jwt token
      const token = await user.getJWT();
      //add token to cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 1* 3600000),
      });

      res.send('login successful !');
    } else {
      throw new Error('password is not valid !')
    }
    
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});


module.exports = authRouter;
