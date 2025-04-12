const express = require('express');


const app = express();


app.use("/hello",(req, res) => {
  res.send("Hello from DevTinder Team!");
});

app.use("/test", (req, res) => {
  res.send("Tester from DevTinder!");
});

app.listen(3000, () => {
  console.log("server is successfully running on port 3000");
  
});