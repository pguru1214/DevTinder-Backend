const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/ConnectionRequest");
const UserModel = require("../models/User"); 
const mongoose = require("mongoose");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({ message: "Invalid toUserId" });
      }

      // ✅ Prevent sending request to self
      if (fromUserId.toString() === toUserId.toString()) {
        return res
          .status(400)
          .json({ message: "You cannot send a request to yourself" });
      }

      // ✅ Check if connection already exists (in either direction)
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already exists!" });
      }

      // ✅ Fetch target user (previously user._id(toUserId) was wrong)
      const toUser = await UserModel.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      // ✅ Create and save connection request
      const connectRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectRequest.save();

      res.status(200).json({
        message: `Connection request sent successfully — ${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).json({ message: "Error: " + err.message });
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      const connectRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectRequest) {
        return res.status(404).json({ message: "Connection request not found" });
      }

      connectRequest.status = status;
      const data = await connectRequest.save();
      res.json({ message: "Connection Request" + status, data });
    } catch (err) {
      res.status(400).send("Error Message:" + err.message);
    }
  }
);

module.exports = requestRouter;
