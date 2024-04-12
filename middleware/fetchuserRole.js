const jwt = require("jsonwebtoken");
const secret = "aniket";
const User = require("../models/userModel");

const fetchuserRole = async (req, res, next) => {
  try {
    const id = await jwt.decode(req.headers.token, secret);
    const userId = id.data;
    const user = await User.findOne({ _id: userId }).select("-password"); 
    if (!user) {
      res.status(400).json({ message: "User not found", success: false });
    }
    if (user.role === "admin") {
      next();
    } else {
      return res.json({
        message: "You don't have access to this resource",
        success: false,
      });
    }
  } catch (error) {
    res.json({
      message: "You dont have access to this resource",
      success: false,
    });
  }
};

module.exports = fetchuserRole;
