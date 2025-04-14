const express = require("express");

const app = express();


app.get("/user", (req, res) => {
  res.send({firstName:"Devil", lastName:"World"})
})

app.post("/user", (req, res) => {
  res.send("Data saved successfully!");
});

app.delete("/user", (req, res) => {
  res.send("Data deleted successfully!");
});

app.use("/test", (req, res) => {
  res.send("Tester from Devil!");
});





app.listen(3000, () => {
  console.log("server is successfully running on port 3000");
});
