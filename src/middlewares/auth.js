const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { findById } = require('../models/user');

const userAuth = async(req,res,next) => {
  try {
    //Read the token from the req cookies
    const { token } = req.cookies;

    if (!token) {
      throw new Error('token is invalid !')
    }

    const decodedData = await jwt.verify(token, "Dev@tinder23");

    const { _id } = decodedData;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("user not found!!");
    }

    req.user = user;
    next();
    //validate the token
    //find the user
  } catch (error) {
    res.status(400).send("Error: "+error.message)
  }
};

module.exports = {
  userAuth,
}