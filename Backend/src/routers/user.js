const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest"); 
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl gender age about";

// ... (your other routes for /requests/received, /connections, /feed remain unchanged) ...
userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched Successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//connections api

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests
      .map((row) => {
        if (row.fromUserId && row.toUserId) {
          if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
            return row.toUserId;
          }
          return row.fromUserId;
        }
        return null;
      })
      .filter((item) => item !== null);

    res.json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//feed api
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific user's public profile
userRouter.get("/profile/:userId", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUserId = req.user._id;


    // Validate userId format (MongoDB ObjectId is 24 hex characters)
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Check if the users are connected
    const connection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: loggedInUserId, toUserId: userId, status: "accepted" },
        { fromUserId: userId, toUserId: loggedInUserId, status: "accepted" },
      ],
    });

     if (!connection) {
       return res
         .status(403)
         .json({ message: "You are not connected with this user" });
     }

     // Fetch the user's profile (exclude sensitive data like password)
     const user = await User.findById(userId).select(USER_SAFE_DATA);


     if (!user) {
       return res.status(404).json({ message: "User not found" });
     }

     res.json({ data: user });

    res.json(user);
  } catch (err) {
     res
       .status(500)
       .json({ message: "Error fetching profile: " + err.message });
  }
});

module.exports = userRouter;
