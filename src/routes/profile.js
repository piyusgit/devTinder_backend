const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  validateEditData,
  validatePasswordData,
} = require("../utils/validation");

// Api for viewing the user
router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("No user found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// Api for updating the user data in the database
router.patch("/profile/edit", userAuth, async (req, res) => {
  // console.log(req.body);
  try {
    if (!validateEditData(req)) {
      throw new Error("Request body contain non allowed field");
    }
    if (
      req.body.skills &&
      Array.isArray(req.body.skills) &&
      req.body.skills.length > 10
    ) {
      throw new Error("Skills can't be more than 10");
    }

    const loggedUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));

    await loggedUser.save();

    res.json({ message: "Profile updated successfully", data: loggedUser });
  } catch (err) {
    console.log(err);
    res.status(400).send("ERROR: " + err.message);
  }
});

// Api for updating the password of a user
router.patch("/profile/forgetPassword", userAuth, async (req, res) => {
  try {
    validatePasswordData(req);
    const loggedUser = req.user;
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      loggedUser.password
    );
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }
    const hashPassword = await bcrypt.hash(req.body.newPassword, 10);

    loggedUser.password = hashPassword;

    await loggedUser.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = { profileRouter: router };
