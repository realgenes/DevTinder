const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const User = require('../models/user')
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          error: "status is invalid !",
        });
      }
      //check toUser and fromuser are not same

      if (fromUserId.equals(toUserId)) {
        return res.status(400).json({
          error:"can't send request to yourself !"
        })
      }

      //check user to whom request is sent is exist or not
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          error:"User not found !"
        })
      }

      //check if there is an existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          error: "connection request exists already!",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: req.user.firstName + " "+ status+" "+toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR " + error.message);
    }
  }
);

module.exports = requestRouter;
