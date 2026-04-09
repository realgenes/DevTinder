const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();

const isCrossSiteDeployment = () => {
  if (process.env.FRONTEND_URL) {
    return !process.env.FRONTEND_URL.includes("localhost");
  }
  return process.env.NODE_ENV === "production";
};

const buildCookieOptions = (overrides = {}) => {
  const isProduction = isCrossSiteDeployment();
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    ...overrides,
  };
};

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
    res.cookie("token", token, buildCookieOptions());

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
      res.cookie("token", token, buildCookieOptions());

      res.send(user);
    } else {
      throw new Error("password is not valid !");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, buildCookieOptions({ maxAge: 0 }));
  res.send("Logout Successfully !");
});

authRouter.post("/password/forgot", async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!emailId || !validator.isEmail(emailId)) {
      return res.status(400).json({ message: "Valid email is required." });
    }

    const user = await User.findOne({ emailId: emailId.toLowerCase() });

    // Always return a generic success response to avoid leaking account existence
    if (!user) {
      return res.json({
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/login?resetToken=${resetToken}`;

    const response = {
      message:
        "If an account with that email exists, a reset link has been sent.",
    };

    // For local/dev usage we expose reset token details when email service isn't configured.
    if (process.env.NODE_ENV !== "production") {
      response.resetToken = resetToken;
      response.resetUrl = resetUrl;
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Failed to process forgot password." });
  }
});

authRouter.post("/password/reset/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required." });
    }

    if (!newPassword || !validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        message:
          "Password is not strong enough. Use a mix of letters, numbers, and symbols.",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Reset token is invalid or expired." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. Please login now." });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset password." });
  }
});

module.exports = authRouter;
