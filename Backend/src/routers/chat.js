const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Message = require("../models/message");

const chatRouter = express.Router();

chatRouter.get("/messages/:receiverId", userAuth, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = chatRouter;
