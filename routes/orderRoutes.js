
const express = require("express"); 
const { cartCheckout, getUserOrders, userCart, payment, verifyPayment } = require("../controllers/orderController");

const router = express.Router();

router.route("/user/orders").get(getUserOrders)  
router.route("/user/orders/:id").post(userCart)
router.route("/checkout").post(cartCheckout)
router.route("/payment").post(payment)
router.route("/verifyPayment").post(verifyPayment)

module.exports=router;