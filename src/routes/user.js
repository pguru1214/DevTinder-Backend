const express = require("express");

const User = require("../models/User");

const userRouter = express.Router();

const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/ConnectionRequest");

userRouter.get("/user", userAuth, async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// get multiple users data
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// delete user data

userRouter.delete("/user", userAuth, async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// update data of the user

userRouter.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "photoURL",
      "about",
      "skills",
      "age",
      "gender",
      "lastName",
    ];
    const isUpdaateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdaateAllowed) {
      throw new Error("Update not allowed");
    }
    if (skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "Interested",
    })
      .populate("fromUserId", ["firstName lastName"])
      .populate("fromUserId", "firstName lastName");


      res.json({
        message:"Data Fetched Successfully",
        data: connectionRequest
      })
  } catch (err) {
    res.status(400).json({
      mssage: err.message,
    });
  }
});

module.exports = userRouter;
