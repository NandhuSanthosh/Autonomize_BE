import bcrypt from "bcrypt";

export const hashPassword = async (plainPassword) => {
  const saltRounds = 10; // cost factor (higher = more secure but slower)
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

export const comparePassword = async (password, hashedPassword) => {
  console.log(hashedPassword, password);
  return bcrypt.compare(password, hashedPassword);
};
