import mongoose from "mongoose";
import Order from "../models/order.js";

export async function addOrder(req, res) {
  try {
    const order = await Order.create(req.body);
    return res.status(201).json(order);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Could not save order:", error.message);
    return res.status(500).json({ message: "The order could not be saved." });
  }
}

export async function getOrders(req, res) {
  try {
    const filter = {};
    if (req.query.buyerId) filter.buyerId = req.query.buyerId;
    if (req.query.sellerId) filter.sellerId = req.query.sellerId;
    return res.json(await Order.find(filter));
  } catch (error) {
    console.error("Could not load orders:", error.message);
    return res.status(500).json({ message: "Orders could not be loaded." });
  }
}

export async function getOrder(req, res) {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ message: "Order not found." });
    return res.json(order);
  } catch (error) {
    console.error("Could not load order:", error.message);
    return res.status(500).json({ message: "The order could not be loaded." });
  }
}

export async function updateOrder(req, res) {
  const updates = { ...req.body };
  delete updates.id;
  delete updates._id;
  delete updates.__v;

  try {
    const order = await Order.findOneAndUpdate(
      { id: req.params.id },
      updates,
      { returnDocument: "after", runValidators: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    return res.json(order);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Could not update order:", error.message);
    return res.status(500).json({ message: "The order could not be updated." });
  }
}

export async function deleteOrder(req, res) {
  try {
    const order = await Order.findOneAndDelete({ id: req.params.id });
    if (!order) return res.status(404).json({ message: "Order not found." });
    return res.json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error("Could not delete order:", error.message);
    return res.status(500).json({ message: "The order could not be deleted." });
  }
}
