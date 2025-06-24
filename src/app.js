const express = require("express");
const connectDB =   require("./config/database");
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const{validateSignUpData} = require('./utils/validation')

app.use(express.json());

app.post("/signup", async (req, res) => { 


  try {
    //validate data
    validateSignUpData(req);

    const { password, firstName, lastName, emailId, skills, age,gender } = req.body;

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

})

//get user data using email

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail });

    if (!user) {
      res.send('user not found')
    } else {
       res.send(user);
    }

   


    // const user = await User.find({ emailId: userEmail });

    // if (user.length === 0) {
    //   res.status(401).send('user not found');
    // } else {
    //    res.send(user);
    // }
   
    
  } catch (error) {
    res.status(500).send("some error happened");
  }
});

//feed API - GET /feed - get all the users from the database
app.get("/feed",async(req,res) => {
  
  try {
    const users = await User.find({});
    res.send(users);
    
  } catch (error) {
    res.status(401).send('something went  wrong')
  }
})

//delete user api
app.delete('/user', async(req,res) => {
  const userId = req.body.userId
  
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send('user deleted!')
  } catch (error) {
    res.status(401).send('error')
  }
})

//update user details api
app.patch('/user', async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

 

  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "photoUrl",
      "gender",
      "about",
      "skills",
      "userId",
      "emailId",
      "password"
    ];

    const isUpdate_Allowed = Object.keys(data).every((k) => {
      return ALLOWED_UPDATES.includes(k);
    });

    if (data.skills.length > 10) {
      throw new Error("more than 10 skills not allowed!")
    }

    if (!isUpdate_Allowed) {
      throw new Error("update not allowed!");
    } 
    const before = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
      returnDocument: "after",
    });
    console.log(before);
    res.send("user updated successfully");
  } catch (error) {
    res.status(400).send("Error! " + error.message);
  }

  
});








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



