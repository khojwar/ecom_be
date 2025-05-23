
const mongoose = require("mongoose");
const { USER_ROLES, Status, GENDER } = require("../../config/constant");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 2,
    max: 100,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,               // if you got error status code 11000, it means that the email already exists in the database (it is unique validation failed )
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES) ,
    default: USER_ROLES.CUSTOMER,
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.INACTIVE,
  },
  address: {
    billingAddress: String,
    shippingAddress: String,
  },
  phone: {
    type: String,
  },
  gender: {
    type: String,
    enum: Object.values(GENDER),
    default: GENDER.MALE,
  },
  dob: Date,
  activationToken: String,
  forgetPasswordToken: String,
  expiryTime: Date,
  image:{
    secureUrl: String,
    publicId: String,
    optimizedUrl: String,
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
}, {
    autoCreate: true, // automatically create the collection if it doesn't exist
    autoIndex: true, // automatically create indexes
    timestamps: true,   // automatically add createdAt and updatedAt fields
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
