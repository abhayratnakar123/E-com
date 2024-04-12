const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: Object,
    required: true,
  },
  products: [
    {
      type: Object,
      required: true,
    },
  ],
  userid: {
    type: String,
    required: true,
    trim:true
  },
  address: {
    type: String,
    required: true,
    trim:true
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
