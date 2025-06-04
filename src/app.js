const express = require("express");

const app = express();

app.get("/home", (req,res) => {
  res.send({ "firstName": "Shishupal", "lastName": "Singh" });
})

app.patch('/home',(req,res) => {
  res.send("Data patched succcessfully");
})

app.put('/home', (req,res) => {
  res.send("data putted succesfully");
})

app.post('/home', (req, res) => {
  console.log("This is post call");
  res.send("data successfull send to DB");
})



app.listen(7777, () => {
  console.log("Server is listening on port 7777");
});