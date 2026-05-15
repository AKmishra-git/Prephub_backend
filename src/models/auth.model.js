const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      
      default: null,
    },

    googleId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
)

const userModel = mongoose.model("User", userSchema)

module.exports = userModel
