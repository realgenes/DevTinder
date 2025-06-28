const express = require("express");
const connectDB = require("./config/database");
const { userAuth} = require('./middlewares/auth');
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const{validateSignUpData} = require('./utils/validation')

app.use(express.json());
app.use(cookieParser());

//sign up api
app.post("/signup", async (req, res) => {
  try {
    //validate data
    validateSignUpData(req);

    const { password, firstName, lastName, emailId, skills, age, gender } = req.body;

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
    res.status(400).send('Error :' + err.message);
  }

});

//login api
app.post("/login", async (req, res) => {
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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //create a jwt token
      const token = await jwt.sign({ _id: user._id }, "Dev@tinder23", {
        expiresIn: "7d",
      });

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

//profile api
app.get("/profile", userAuth,async (req, res) => {
  try {
     

    const user = req.user;
    
    res.send(user);
    
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }

 
})


//send connection request
app.post("/sendConnection", userAuth, (req, res) => {
  
  const user = req.user;

  
  res.send(user.firstName +' sent connection request !');
})







connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database can not be established..");
  });



