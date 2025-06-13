const express = require("express");
const connectDB =   require("./config/database");
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post("/signup", async (req, res) => { 
  const user = new User(req.body);

  try {
    await user.save();
    res.send('user added successfully!')
  } catch (err) {
    res.status(400).send('Error in file saving');
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
app.patch('/user', async(req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const before = await User.findByIdAndUpdate({ _id: userId }, data);
    console.log(before);
    res.send('user updated successfully')
  } catch (error) {
    res.send('Some error there!');
  }
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



