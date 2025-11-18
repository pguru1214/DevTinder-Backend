const User = require("../models/User")
const jwt = require("jsonwebtoken")

const userAuth =  async (req,res,next) =>{
    try {
        const {token} = req.cookies;
        if(!token) {
            return res.status(401).send("Please Login!!")
        }
        const decodeMsg = await jwt.verify(token, "DEV@TINDER$990");

        const {_id} = decodeMsg
        const user = await User.findById(_id)
        if(!user) {
            throw new Error("User not found")
        }
        req.user = user
        next()
    } catch(err) {
         res.status(400).send("Error:" + err.message);
    }
}

module.exports = userAuth