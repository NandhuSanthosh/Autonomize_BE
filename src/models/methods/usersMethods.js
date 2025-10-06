import Users from "../schemas/usersSchema.js";

export const findUserWithEmail = async ({ email }) => {
  const result = await Users.findOne({ email });
  return result;
};

export const updateUserWithEmail = async ({ email, data }) => {
  const result = await Users.updateOne({ email }, data);
  return result;
};

export const createNewUser = async (data) => {
  const result = await Users.insertOne(data);
  return result;
};

export const findUserByUserId = async (_id) => {
  return await Users.findById(_id);
};
