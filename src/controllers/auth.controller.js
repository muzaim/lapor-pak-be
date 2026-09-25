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
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }
  const existingUser = await UserModel.findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await UserModel.createUser({
    name,
    email,
    password: hashedPassword,
    role: "USER",
  });

  const newUser = await UserModel.findUserById(userId);

  return res.status(201).json({
    message: "User registered successfully",
    data: newUser,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = await UserModel.findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return res.status(200).json({
    message: "Login successful",
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
    message: "Profile retrieved successfully",
    data: req.user,
  });
}

async function changePassword(req, res) {
  const currentPassword =
    req.body.old_password ||
    req.body.current_password ||
    req.body.oldPassword ||
    req.body.currentPassword;
  const newPassword = req.body.new_password || req.body.newPassword;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: "Old password and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: "New password must be at least 6 characters long",
    });
  }

  const userId = req.user.id;
  const user = await UserModel.findUserByIdWithPassword(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Incorrect old password" });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      message: "New password cannot be the same as old password",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await UserModel.updatePassword(userId, hashedPassword);

  return res.status(200).json({
    message: "Password changed successfully",
  });
}

async function resetPassword(req, res) {
  const { email, id, user_id } = req.body || {};
  let targetId = id || user_id || req.params?.id;
  let user = null;

  if (req.user && req.user.id) {
    user = await UserModel.findUserById(req.user.id);
  }

  if (!user && req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      try {
        const { verifyToken } = require("../utils/jwt");
        const decoded = verifyToken(token);
        if (decoded && decoded.id) {
          user = await UserModel.findUserById(decoded.id);
        }
      } catch (err) {
        // ignore invalid token in auth reset password fallback
      }
    }
  }

  if (!user && email) {
    user = await UserModel.findUserByEmail(email);
  }

  if (!user && targetId) {
    user = await UserModel.findUserById(targetId);
  }

  if (!user) {
    return res.status(404).json({
      message: "Pengguna tidak ditemukan. Harap sertakan token, email, atau ID pengguna.",
    });
  }

  const DEFAULT_PASSWORD = "123456";
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  await UserModel.updatePassword(user.id, hashedPassword);

  return res.status(200).json({
    message: "Password berhasil direset menjadi 123456",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      default_password: DEFAULT_PASSWORD,
    },
  });
}

module.exports = {
  register,
  login,
  getProfile,
  changePassword,
  resetPassword,
};
