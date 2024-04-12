const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Product = require("../models/productModel");

const generateAuthToken = (userId) => {
  return jwt.sign({ data: userId }, process.env.JWT_SECRET);
};

const handleError = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};

const handleSuccess = (res, data) => {
  return res.status(200).json({ success: true, ...data });
};

// API - Register User
const createUser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      return handleError(res, 400, "Please fill all the credentials");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return handleError(res, 400, "User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
      pic,
      cartItems: [],
    });

    const authToken = generateAuthToken(user.id);

    return handleSuccess(res, { user, authToken });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

// API - Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return handleError(res, 400, "Please fill all the credentials");
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return handleError(res, 400, "User not found");
    }

    const authToken = generateAuthToken(user.id);

    return handleSuccess(res, { user: user, authToken });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

// API - Get User
const getUser = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers.token, process.env.JWT_SECRET)?.data;

    if (!userId) {
      return handleError(res, 400, "Invalid token");
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return handleError(res, 400, "User not found");
    }

    let totalPrice = 0;
    for (let i = 0; i < user.cartItems.length; i++) {
      totalPrice += user.cartItems[i].price * user.cartItems[i].quantity;
    }

    return handleSuccess(res, { totalCartPrice: totalPrice, user });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

// API - update User
const updateUser = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers.token, process.env.JWT_SECRET)?.data;

    const { address } = req.body; 
    if (!userId) {
      return handleError(res, 400, "Invalid token");
    }

    const user = await User.findById(userId).select("-password"); 
    if (!user) {
      return handleError(res, 400, "User not found");
    }

    user.address.unshift(address);
    await user.save();
    return handleSuccess(res, { user });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

// API - Delete Cart items
const deleteCartItems = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers.token, process.env.JWT_SECRET)?.data;
    const user = await User.findById(userId);

    if (!user) {
      return handleError(res, 400, "User not found");
    }

    const productid = req.query.productid;
    const product = await Product.findById(productid);
    if (!product) {
      return handleError(res, 400, "Product not found");
    }
    user.cartItems = user.cartItems.filter(
      (item) => item.product._id.toString() !== productid
    );
    await user.save();

    return handleSuccess(res, { id: productid });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

// API - Update Cart Item Price and quantity
const cartItemQuantity = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers.token, process.env.JWT_SECRET)?.data;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return handleError(res, 400, "User not found");
    }

    const productid = req.query.productid;
    const product = await Product.findById(productid);
    if (!product) {
      return handleError(res, 400, "Product not found");
    }

    const { quantity } = req.body;

    user.cartItems.forEach((item) => {
      if (item.product._id.toString() === productid) {
        item.quantity = quantity;
      }
    });

    const resultedUser = await user.save();
    return handleSuccess(res, { resultedUser });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  updateUser,
  deleteCartItems,
  cartItemQuantity,
};
