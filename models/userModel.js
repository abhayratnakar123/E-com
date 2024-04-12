const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: Object,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim:true
  },
  name: {
    type: String,
    required: true,
    trim:true
  },
  password: {
    type: String,
    required: true,
    trim:true
  },
  address: {
    type: [String],
    default: [],
  },
  role: {
    type: String,
    default: "user",
    trim:true
  },
  cartItems: [cartItemSchema],
  pic: {
    type: String,
    default: "https://lippianfamilydentistry.net/wp-content/uploads/2015/11/user-default.png",
    trim:true
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
