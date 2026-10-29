import mongoose from "mongoose";
import Category from "../models/category.js";

export async function addCategory(req, res) {
  try {
    const category = await Category.create(req.body);
    return res.status(201).json(category);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "That category already exists." });
    }
    console.error("Could not save category:", error.message);
    return res.status(500).json({ message: "The category could not be saved." });
  }
}

export async function getCategories(req, res) {
  try {
    return res.json(await Category.find());
  } catch (error) {
    console.error("Could not load categories:", error.message);
    return res.status(500).json({ message: "Categories could not be loaded." });
  }
}

export async function getCategory(req, res) {
  try {
    const category = await Category.findOne({ id: req.params.id });
    if (!category) return res.status(404).json({ message: "Category not found." });
    return res.json(category);
  } catch (error) {
    console.error("Could not load category:", error.message);
    return res.status(500).json({ message: "The category could not be loaded." });
  }
}

export async function updateCategory(req, res) {
  try {
    const category = await Category.findOneAndUpdate(
      { id: req.params.id },
      { name: req.body.name, description: req.body.description },
      { returnDocument: "after", runValidators: true },
    );
    if (!category) return res.status(404).json({ message: "Category not found." });
    return res.json(category);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "That category already exists." });
    }
    console.error("Could not update category:", error.message);
    return res.status(500).json({ message: "The category could not be updated." });
  }
}

export async function deleteCategory(req, res) {
  try {
    const category = await Category.findOneAndDelete({ id: req.params.id });
    if (!category) return res.status(404).json({ message: "Category not found." });
    return res.json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error("Could not delete category:", error.message);
    return res.status(500).json({ message: "The category could not be deleted." });
  }
}
