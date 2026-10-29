import mongoose from "mongoose";
import Product from "../models/product.js";

export async function addProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    console.log(`Product saved to MongoDB: ${product.id}`);
    res.status(201).json({ message: "Product added successfully.", id: product.id });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.error("Product validation failed:", error.message);
      return res.status(400).json({ message: error.message });
    }

    if (error.code === 11000) {
      return res.status(409).json({ message: "A product with this ID already exists." });
    }

    console.error("Could not save product:", error.message);
    return res.status(500).json({ message: "The product could not be saved." });
  }
}

export async function getProducts(req, res) {
  try {
    const filter = req.query.sellerId ? { sellerId: req.query.sellerId } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error("Could not load products:", error.message);
    res.status(500).json({ message: "Products could not be loaded." });
  }
}

export async function getProduct(req, res) {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.json(product);
  } catch (error) {
    console.error("Could not load product:", error.message);
    return res.status(500).json({ message: "The product could not be loaded." });
  }
}

export async function updateProduct(req, res) {
  const updates = { ...req.body };
  delete updates.id;
  delete updates._id;
  delete updates.__v;

  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      updates,
      { returnDocument: "after", runValidators: true },
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.json({ message: "Product updated successfully.", product });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Could not update product:", error.message);
    return res.status(500).json({ message: "The product could not be updated." });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Could not delete product:", error.message);
    return res.status(500).json({ message: "The product could not be deleted." });
  }
}
