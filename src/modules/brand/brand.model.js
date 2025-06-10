const mongoose = require("mongoose");
const { Status } = require("../../config/constant");

const brandSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        min: 2,
        max: 50,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
      // A slug is a URL-friendly version of the name, typically lowercased and with spaces replaced by hyphens
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    logo: {
        publicId: String,
        secureUrl: String,
        optimizedUrl: String,
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.INACTIVE,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
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
