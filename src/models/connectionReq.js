const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // reference to the user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is not supported",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index
requestSchema.index({ fromUserId: 1, toUserId: 1 });
requestSchema.pre("save", function (next) {
  const connectionReq = this;

  if (connectionReq.fromUserId.equals(connectionReq.toUserId)) {
    throw new Error("You can't send request to yourself");
  }
  next();
});

const ConnectionReq = mongoose.model("connectionReq", requestSchema);
module.exports = ConnectionReq;
