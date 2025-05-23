const mongoose = require("mongoose");
const { Status } = require("../../config/constant");

const brandSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    logo: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.INACTIVE,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
  },
  {
    autoCreate: true,
    autoIndex: true,
    timestamps: true,
  }
);

const BrandModel = mongoose.model("Brand", brandSchema);
module.exports = BrandModel;
