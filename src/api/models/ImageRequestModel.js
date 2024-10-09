const mongoose = require("mongoose");

const imageRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  serialNumber: { type: Number, required: true },
  productName: { type: String, required: true },
  inputImageUrls: { type: [String], required: true },
  outputImageUrls: { type: [String], default: [] },
  status: {
    type: String,
    enum: ["pending", "processing", "completed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ImageRequest", imageRequestSchema);
