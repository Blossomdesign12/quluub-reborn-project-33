
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    fname: { 
      type: String, 
      required: true 
    },
    lname: { 
      type: String, 
      required: true 
    },
    plan: { 
      type: String, 
      enum: ["freemium", "premium", "pro"], 
      default: "freemium" 
    },
    gender: { 
      type: String, 
      enum: ["male", "female"], 
      required: true 
    },
    dob: { 
      type: Date 
    },
    startedPracticing: {
      type: Date
    },
    hidden: {
      type: Boolean,
      default: false
    },
    validationToken: { 
      type: String, 
      default: "" 
    },
    resetPasswordToken: { 
      type: String, 
      default: "" 
    },
    resetPasswordTokenExpiration: { 
      type: Date, 
      default: null 
    },
    status: { 
      type: String, 
      enum: ["active", "inactive"], 
      default: "active" 
    },
    referralCode: {
      type: String,
      unique: true
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    referralStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: 'Pending'
    },
    referralStats: {
      totalReferrals: { type: Number, default: 0 },
      activeReferrals: { type: Number, default: 0 },
      completedReferrals: { type: Number, default: 0 }
    },
    videoCallCredits: {
      type: Number,
      default: 0
    },
    waliDetails: { 
      type: String, // JSON string e.g. '{"email":"wali@example.com"}'
      default: ""
    },
    nationality: { type: String },
    country: { type: String },
    build: { type: String },
    appearance: { type: String },
    maritalStatus: { type: String },
    patternOfSalaah: { type: String },
    genotype: { type: String },
    summary: { type: String },
    workEducation: { type: String },
    lastSeen: { type: Date },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON:   { virtuals: true }
  }
);

// Create a virtual 'id' field that returns _id as string
userSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Hash the password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password matches
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
