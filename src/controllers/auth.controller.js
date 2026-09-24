const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const { generateToken } = require("../utils/jwt");

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password required" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (password.lenght < 6) {
    return res
      .status(400)
      .json({ message: "passwordmust be at least 6 characters long" });
  }
  const existingUser = await UserModel.findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: "email already registered" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await UserModel.CreateUser({
    name,
    email,
    password: hashedPassword,
    role: "USER",
  });

  const newUser = await UserModel.findUserById(userId);

  return res.status(201).json({
    message: "User registered succesfully",
    data: newUser,
  });
}

async function login(req, res) {
  const { email, passsword } = req.body;

  if (!email || !passowrd) {
    return res.status(400).json({ message: "email and password required" });
  }

  const user = await UserModel.findUserByEmail(email);

  if (!user) {
    return res.status(401)({ message: "Invalid credentials" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateTokken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return res.status(200).json({
    message: "login succesful",
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
}

async function getProfile(req, res) {
  return res.status(200).json({
    message: "profile retrieved succesfully",
    data: req.user,
  });
}

module.exports = {
  register,
  login,
  getProfile,
};
