const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(`${process.env.MONGO_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connect with server"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  displayName: String,
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.post("/register", (req, res) => {
  const { displayName, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registerd" });
    } else {
      const user = new User({
        displayName,
        email,
        password,
      });
      user.save((err) => {
        res.send({ message: "Successfully Registered" });
      });
    }
  });
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successfull", user: user });
      } else if (password !== user.password) {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  });
});
//update profile
app.post("/update/:id", async function (req, res) {
  const id = req.params.id;
  let updatedUser = {};
  updatedUser.email = req.body.displayName;
  updatedUser.password = req.body.password;

  await User.findByIdAndUpdate(id, updatedUser, function (err, updatedData) {
    if (err) {
      console.log(err);
    } else {
      console.log(updatedData);
      //res.redirect or res.send whatever you want to do
    }
  });
});
app.listen(port, () => {
  console.log(`Application running in port no ${port}`);
});
