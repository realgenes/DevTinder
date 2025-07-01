const express = require('express');
const authRouter = express.Router();

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

    await user.save();
    res.send("user added successfully!");
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});


module.exports = authRouter;
