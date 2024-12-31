const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionReq = require("../models/connectionReq");

const router = express.Router();

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    // Check allowed status
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid Status type: " + status });
    }

    // if (fromUserId === toUserId) {
    //   return res
    //     .status(400)
    //     .json({ message: "You can't send request to yourself" });
    // }

    // Check if the user exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({ message: "No user found" });
    }

    // Check existing connections
    const existingConnection = await ConnectionReq.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnection) {
      return res
        .status(400)
        .json({ message: "Connection Request already exists!" });
    }

    // Creating a new connection request instance
    const connectionReq = new ConnectionReq({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionReq.save();
    res.json({
      message: req.user.firstName + "is" + status + "in" + toUser.firstName,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      // validate the status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid Status type: " + status });
      }
      // Request send one user to another user
      // Is the user logged in (loggedInUserId = toUserId)
      // status = interested
      // request id should be valid
      // Check if the user exists
      const connectionReq = await ConnectionReq.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionReq) {
        return res.status(400).json({ message: "Request not found" });
      }
      connectionReq.status = status;
      const data = await connectionReq.save();
      res.json({ message: "Connection Request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = { requestRouter: router };
