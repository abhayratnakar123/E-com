
const express = require("express");
const { createUser, loginUser,getUser, deleteCartItems, cartItemQuantity, updateUser } = require("../controllers/userController")
const router = express.Router();

router.post("/signup",createUser)
router.post("/login",loginUser)
router.get("/getUser",getUser) 
router.put("/update",updateUser) 
router.delete("/cart/delete",deleteCartItems)
router.put("/cart/update",cartItemQuantity)


module.exports=router;