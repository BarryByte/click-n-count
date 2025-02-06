const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  sessionCode: { type: String, required: true, unique: true },
  polls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }],
});

module.exports = mongoose.model("Session", SessionSchema);
