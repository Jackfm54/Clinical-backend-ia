const mongoose = require("mongoose");

const healthDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    heartRate: {
      type: Number,
      required: true,
    },
    bloodPressure: {
      type: String,
      required: true,
    },
    oxygenLevel: {
      type: Number,
      required: true,
    },
    riskLevel: { type: String, default: "🟢 Faible" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthData", healthDataSchema);
