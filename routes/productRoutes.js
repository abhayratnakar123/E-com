
const express = require("express");
const fetchuserRole = require("../middleware/fetchuserRole");
const { addProduct,getAllProducts,getAProduct } = require("../controllers/productController");

const router = express.Router();

router.get("/",getAllProducts)
router.post("/add",fetchuserRole,addProduct)
router.get("/:id",getAProduct)



module.exports=router;