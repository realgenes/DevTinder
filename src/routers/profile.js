const express = require("express");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const validator = require("validator");
const { validateProfileEditData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("invalid edit request !");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser);

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/update-password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Old and new passwords are required !" });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        error:"old and new passwords should not be same!"
      })
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res
        .status(400)
        .json({ error: "new password is not strong enough !" });
    }

    const userEmailId = req.user.emailId;
    const user = await User.findOne({emailId:userEmailId});

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const isSame = await bcrypt.compare(oldPassword, user.password);
    
    if (!isSame) {
      return res.status(401).json({ error: "Old password is incorrect !" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully !" });


  } catch (err) {
    res.json({error:"something wrong !"+err})
  }
});

module.exports = profileRouter;
