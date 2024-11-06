import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: "36h",
  });
  const refreshToken = jwt.sign(
    { userId: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export { generateToken };
