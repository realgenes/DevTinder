const express = require("express");

const app = express();



// app.get("/user", (req, res) => {
//   res.send({firstName:"Devil", lastName:"World"})
// })


app.get("/user/:userId/:name/:password", (req, res) => {
  console.log(req.params);
  res.send({firstName:"Devil", lastName:"World"})
})





app.listen(3000, () => {
  console.log("server is successfully running on port 3000");
});
