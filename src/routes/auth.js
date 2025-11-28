const express = require("express");

const authRouter = express.Router();

const User = require("../models/User");

const { validateSignupData } = require("../utils/Validation");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password, skills } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      skills,
    });
    const savedUser = await user.save();
    // const token = await savedUser.jwt.sign(
    //   { _id: user._id },
    //   "DEV@TINDER$990",
    //   {
    //     expiresIn: "9d",
    //   }
    // );
    // res.cookie("token", token);
    res.json({ message: "User signed up Successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("Error Saving the user:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // const token = await user.getJWT();
      // res.cookie("token", token, {
      //   expires: new Date(Date.now() + 8 * 3600000),
      // });
      const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$990", {
        expiresIn: "9d",
      });

      res.cookie("token", token);
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      express: new Date(Date.now()),
    });
    res.status(200).send("Logout Successfully");
  } catch (err) {
    throw new Error("Error: " + err.message);
  }
});

module.exports = authRouter;
