const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); // Use crypto for shorter unique IDs

const generateUserId = () => {
  return crypto.randomBytes(4).toString("hex"); // Generates an 8-character unique ID
};

const userSignupSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: generateUserId, 
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      minlength: 6,
    },
    phoneNo: {
      type: String,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"], // Ensure valid phone format
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values, ensuring only Google users have this
    },
    status: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

const UserSignUpInfo = mongoose.model("UserSignUpInfo", userSignupSchema);
module.exports = UserSignUpInfo;
