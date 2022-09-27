var mongoose = require("mongoose");

const faqSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  category: { type: String, required: true },
  createdAt: { type: String, default: Date.now },
});

module.exports = mongoose.model("faq", faqSchema);
