const mongoose = require("mongoose");

const mailSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    emails: {
      type: [String],
      required: true,
    },

    status: {
      type: String,
      enum: ["Success", "Failed"],
      default: "Success",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Mail", mailSchema);