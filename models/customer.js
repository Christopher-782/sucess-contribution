const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Customer", CustomerSchema);
