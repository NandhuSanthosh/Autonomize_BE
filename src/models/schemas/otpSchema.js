import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    trim: true,
    required: true,
  },
  type: {
    type: String,
    enum: ["signin"],
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  issuedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isExpired: {
    type: Boolean,
    default: false,
  },
});

otpSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });
const OTPs = mongoose.model("Otps", otpSchema);

export default OTPs;
