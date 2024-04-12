const Product = require("../models/productModel"); 

const handleError = (res, statusCode, message, success = false) => {
  return res.status(statusCode).json({ success, message });
};

const handleSuccess = (res, data) => {
  return res.status(200).json({ success: true, ...data });
};

// API - Add a Product (ADMIN)
const addProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    if (!name || !description || !category || !price || !category) {
      return handleError(res, 400, "Please fill all the details");
    }

    const existingProduct = await Product.findOne({
      name,
      description,
      price,
      image,
      category,
    });

    if (existingProduct) {
      return handleError(res, 400, "Product already exists");
    }

    const product = await Product.create({
      name,
      description,
      category,
      price,
      image,
    });

    return handleSuccess(res, { product });
  } catch (error) {
    return handleError(res, 400, error.message);
  }
};

// API - Get a Product
const getAProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return handleError(res, 404, "Error fetching product");
    }
    return handleSuccess(res, { product });
  } catch (error) {
    return handleError(res, 400, "Error fetching product: " + error.message);
  }
};

// API - Get all Products
const getAllProducts = async (req, res) => {
  try {
    const search = req.query.search;
    const category = req.query.category;

    let query = {};

    if (search) {
      const regexString = search
        .split(" ")
        .map((word) => `(?=.*${word})`)
        .join(""); 
      query.$or = [
        { category: { $regex: regexString, $options: "i" } },
        { name: { $regex: regexString, $options: "i" } },
        { description: { $regex: regexString, $options: "i" } },
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    const products = await Product.find(query);

    return handleSuccess(res, { productsCount: products.length, products });
  } catch (error) {
    return handleError(res, 400, error.message);
  }
};

module.exports = { addProduct, getAProduct, getAllProducts };
