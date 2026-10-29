import mongoose from "mongoose";
import Exchange from "../models/exchange.js";

export async function addExchange(req, res) {
  try {
    return res.status(201).json(await Exchange.create(req.body));
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Could not save exchange:", error.message);
    return res.status(500).json({ message: "The exchange could not be saved." });
  }
}

export async function getExchanges(req, res) {
  try {
    const filter = req.query.buyerId ? { buyerId: req.query.buyerId } : {};
    return res.json(await Exchange.find(filter));
  } catch (error) {
    console.error("Could not load exchanges:", error.message);
    return res.status(500).json({ message: "Exchanges could not be loaded." });
  }
}

export async function getExchange(req, res) {
  try {
    const exchange = await Exchange.findOne({ id: req.params.id });
    if (!exchange) return res.status(404).json({ message: "Exchange not found." });
    return res.json(exchange);
  } catch (error) {
    console.error("Could not load exchange:", error.message);
    return res.status(500).json({ message: "The exchange could not be loaded." });
  }
}

export async function updateExchange(req, res) {
  const updates = { ...req.body };
  delete updates.id;
  delete updates._id;
  delete updates.__v;

  try {
    const exchange = await Exchange.findOneAndUpdate(
      { id: req.params.id },
      updates,
      { returnDocument: "after", runValidators: true },
    );
    if (!exchange) return res.status(404).json({ message: "Exchange not found." });
    return res.json(exchange);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Could not update exchange:", error.message);
    return res.status(500).json({ message: "The exchange could not be updated." });
  }
}

export async function deleteExchange(req, res) {
  try {
    const exchange = await Exchange.findOneAndDelete({ id: req.params.id });
    if (!exchange) return res.status(404).json({ message: "Exchange not found." });
    return res.json({ message: "Exchange deleted successfully." });
  } catch (error) {
    console.error("Could not delete exchange:", error.message);
    return res.status(500).json({ message: "The exchange could not be deleted." });
  }
}
