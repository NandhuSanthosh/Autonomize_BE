import Otps from "../schemas/otpSchema.js";

export const createOtp = async (payload) => {
  const result = await Otps.insertOne(payload);
  return result;
};

export const findOtpByEmailAndType = async ({ email, type }) => {
  return await Otps.findOne({ email, type });
};

export const updateExpiryOfOtp = async (filter) => {
  const result = await Otps.updateOne(
    {
      ...filter,
      isExpired: false,
      expiryDate: {
        $gt: Date.now(),
      },
    },
    {
      isExpired: true,
    }
  );

  return result.modifiedCount;
};
