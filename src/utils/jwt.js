const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_lapor_pak_123";

function getExpiresIn() {
  const envVal = process.env.JWT_EXPIRES_IN;
  if (!envVal || envVal === "id" || typeof envVal !== "string") {
    return "1d";
  }
  return envVal;
}

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: getExpiresIn() });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
};
