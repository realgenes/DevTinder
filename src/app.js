const express = require("express");

const app = express();

app.use('/express',(req,res) => {
  res.send("this is express server")
})

app.use('/home',(req,res) => {
  res.send('This is home page')
})

app.use('/evo',(req,res) => {
  res.send('this is evo')
})



app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});