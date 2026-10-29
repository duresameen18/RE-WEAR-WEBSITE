import mongoose from "mongoose";
import User from "../models/user.js";

export async function addUser(req, res) {
  try {
    const existingUser = await User.findOne({ id: req.body.id });
    if (existingUser) {
      if (existingUser.email !== req.body.email) {
        return res.status(409).json({ message: "An account with this ID already exists." });
      }
      return res.json({ message: "Account already exists.", id: existingUser.id });
    }

    const user = await User.create({
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      shopName: req.body.shopName,
      passwordHash: req.body.passwordHash,
      passwordSalt: req.body.passwordSalt,
      role: req.body.role,
    });
    return res.status(201).json({ message: "Account created successfully.", id: user.id });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    console.error("Could not save account:", error.message);
    return res.status(500).json({ message: "The account could not be saved." });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    console.error("Could not load accounts:", error.message);
    return res.status(500).json({ message: "Accounts could not be loaded." });
  }
}

export async function getUser(req, res) {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }
    return res.json(user);
  } catch (error) {
    console.error("Could not load account:", error.message);
    return res.status(500).json({ message: "The account could not be loaded." });
  }
}

export async function updateUser(req, res) {
  const updates = {
    name: req.body.name,
    phone: req.body.phone,
    shopName: req.body.shopName,
    status: req.body.status,
    moderationReason: req.body.moderationReason,
  };
  Object.keys(updates).forEach((key) => {
    if (updates[key] === undefined) delete updates[key];
  });

  try {
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      updates,
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }
    return res.json({ message: "Account updated successfully.", user });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Could not update account:", error.message);
    return res.status(500).json({ message: "The account could not be updated." });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findOneAndDelete({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }
    return res.json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Could not delete account:", error.message);
    return res.status(500).json({ message: "The account could not be deleted." });
  }
}
