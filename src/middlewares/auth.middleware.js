const { verifyToken } = require("../utils/jwt");
const UserModel = require("../models/user.model");

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  try {
    const decoded = verifyToken(token);
    const user = await UserModel.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found or invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authenticateToken;
