const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const User = require("../models/user");
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
          error: "can't send request to yourself !",
        });
      }

      //check user to whom request is sent is exist or not
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          error: "User not found !",
        });
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

      let actionMsg = status === "interested" ? "is interested in" : "ignored";
      res.json({
        message: `${req.user.firstName} ${actionMsg} ${toUser.firstName}`,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

module.exports = requestRouter;
