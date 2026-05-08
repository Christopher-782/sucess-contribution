const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");

// GET all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single customer
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE customer
router.post("/", async (req, res) => {
  try {
    const { customerName, balance } = req.body;

    if (!customerName) {
      return res.status(400).json({ message: "customerName is required" });
    }

    const customer = new Customer({
      customerName: customerName.trim(),
      balance: parseFloat(balance) || 0,
    });

    const saved = await customer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE customer
router.put("/:id", async (req, res) => {
  try {
    const { customerName, balance } = req.body;
    const updateData = {};

    if (customerName !== undefined)
      updateData.customerName = customerName.trim();
    if (balance !== undefined) updateData.balance = parseFloat(balance);

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE customer
router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DEPOSIT
router.put("/:id/deposit", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount required" });
    }

    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    customer.balance += parseFloat(amount);
    await customer.save();

    res.json({ message: "Deposit successful", customer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// WITHDRAW
router.put("/:id/withdraw", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount required" });
    }

    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    if (customer.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    customer.balance -= parseFloat(amount);
    await customer.save();

    res.json({ message: "Withdrawal successful", customer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
