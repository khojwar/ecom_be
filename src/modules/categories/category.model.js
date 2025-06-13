const mongoose = require("mongoose");
const { Status } = require("../../config/constant");

// name, slug, parentId, icon, brands, status, createdBy, updatedBy
const categorySchema = new mongoose.Schema(
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
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null, // null means this is a top-level category
    },
    brands: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        default: null,
    }],
    icon: {
        publicId: String,
        secureUrl: String,
        optimizedUrl: String,
    },
    showInMenu: {
        type: Boolean,
        default: false
    },
    homeFeature: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.INACTIVE,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
  },
  {
    autoCreate: true,
    autoIndex: true,
    timestamps: true,
  }
);

const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
