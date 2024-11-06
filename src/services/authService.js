const jwt = require("jsonwebtoken");
const User = require("../db/models/userModels");
const asyncHandler = require("../middleware/AsyncHandler");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const sendToken = (user, statusCode, res) => {
  const token = signToken(user.id); // Menggunakan user.id untuk token
  const cookieOptions = {
    expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined; // Menghilangkan password dari respon
  res.status(statusCode).json({
    token,
    data: user,
  });
};

const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log(`Login attempt for email: ${email}`);

  if (!email || !password) {
    res.status(400);
    console.error("Email and password must not be empty");
    throw new Error("Email and password must not be empty");
  }

  const user = await User.findOne({ where: { email } });

  if (user && (await user.comparePassword(password))) {
    console.log(`Login successful for email: ${email}`);
    sendToken(user, 200, res);
  } else {
    console.error(`Login failed for email: ${email}`);
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

const Register = asyncHandler(async (req, res) => {
  const isFirstAccount = (await User.count()) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const { username, email, password } = req.body;

  try {
    const createUser = await User.create({
      username,
      email,
      password,
      role,
    });
    sendToken(createUser, 201, res);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

const Logout = (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({
    message: "Logout successful",
  });
};

const Getuser = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const user = await User.findByPk(req.user.id); // Menggunakan findByPk untuk mencari user berdasarkan primary key
  if (user) {
    return res.status(200).json({ user });
  }

  return res.status(404).json({
    message: "User not found",
  });
});

const Getalluser = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.findAll(); // Menggunakan findAll untuk mengambil semua user
    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Error fetching users" });
  }
});

const Countuser = asyncHandler(async (req, res) => {
  try {
    const userCount = await User.count();
    res.status(200).json({ count: userCount });
  } catch (error) {
    console.error("Error counting users:", error.message);
    res.status(500).json({ message: "Error counting users" });
  }
});
const GetUserById = asyncHandler(async (req, res) => {
  const userId = req.query.id; // Ambil ID dari query string

  if (!userId) {
    return res.status(400).json({ message: "User ID harus disertakan dalam query." });
  }

  try {
    const user = await User.findByPk(userId); // Gunakan findByPk untuk mencari berdasarkan ID

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return res.status(500).json({ message: "Error fetching user" });
  }
});


module.exports = { Login, Register, Logout, Getuser, Getalluser, Countuser, GetUserById };
