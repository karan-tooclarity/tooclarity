const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: true,
      index: true,
      unique: true, // Each institution has only one active subscription record.
    },
    planType: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "pending"],
      default: "pending",
      index: true,
    },
    // Add time
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      // index: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;