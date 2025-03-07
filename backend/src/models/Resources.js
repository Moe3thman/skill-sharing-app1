const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
});

module.exports = mongoose.model("Resource", ResourceSchema);
