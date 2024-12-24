const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    // Read the token from the req cookie
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token!!");
    }
    // Validate the token
    const decodedObj = await jwt.verify(token, "Cricket");

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Couldn't find user");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
