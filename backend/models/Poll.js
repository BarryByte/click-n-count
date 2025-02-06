const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
  accessCode: { type: String, required: true }, // This should match sessionCode
  question: { type: String, required: true },
  type: { type: String, enum: ["multiple-choice", "open-ended"], required: true },
  options: { type: [String], default: [] },
  results: { type: Object, default: {} },
});

module.exports = mongoose.model("Poll", pollSchema);
