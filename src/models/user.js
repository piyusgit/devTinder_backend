const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address:" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong Password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender type",
      },
      // validate(value) {
      //   if (!["male", "female", "other"].includes(value)) {
      //     throw new Error("Invalid Gender");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIf4R5qPKHPNMyAqV-FjS_OTBB8pfUV29Phg&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL:" + value);
        }
      },
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: "This is the default description of the user!",
      minLength: 20,
      maxLength: 200,
    },
  },
  {
    timestamps: true,
  }
);

// Schema Methods for Getting JWT Tokens
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    {
      _id: user._id,
    },
    "Cricket",
    { expiresIn: "7d" }
  );
  return token;
};

// Schema Methods for Hashing Password

userSchema.methods.validatePassword = async function (inputPassword) {
  const user = this;
  const isPasswordMatch = await bcrypt.compare(inputPassword, user.password);
  return isPasswordMatch;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
