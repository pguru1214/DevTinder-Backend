const mongoose = require("mongoose");

const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
    lastName: { type: String },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invaid eamil address:" + value);
        }
      },
    },
    photoURL: {
      type: String,
      default: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    about: {
      type: String,
      default: "This is a default about the User",
    },
    skills: {
      type: [String],
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Invaid Password:" + value);
        }
      },
    },
    age: { type: Number },
    gender: {
      type: String,
      validate(value) {
        if (["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not Valid");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
