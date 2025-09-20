const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");

const router = express.Router();

router.post("/signup", async (req, res) => {
  // const user = new User({
  //   firstName: "John",
  //   lastName: "Doe",
  //   emailId: "demo@example.com",
  //   password: "demo@example.com",
  // });
  try {
    // Validating the data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypting the password
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

    // Creating a new instance of the User Model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    const savedUser = await user.save();
    const token = await user.getJWT();

    // Add the token to cookie and send the response back to user
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.json({ message: "User Added Successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// Login Api for the user
router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }
    // Create a JWT Token
    const token = await user.getJWT();

    // Add the token to cookie and send the response back to user
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

router.post("/logout", async (req, res) => {
  //   res.cookie("token", null, {
  //     expires: new Date(Date.now()),
  //   });
  res.clearCookie("token");
  res.send("Logout Successful");
});

module.exports = { authRouter: router };
