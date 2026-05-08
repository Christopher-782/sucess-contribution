const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const customerRoutes = require("./routes/customerRoute");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// ========== AUTH SCHEMA & MODEL ==========
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

// JWT Secret (use env variable in production)
const JWT_SECRET =
  process.env.JWT_SECRET || "success-contribution-secret-key-2026";

// ========== SEED DEFAULT ADMIN USER ==========
async function seedDefaultUser() {
  try {
    const defaultUsername = process.env.DEFAULT_USERNAME || "admin";
    const defaultPassword = process.env.DEFAULT_PASSWORD || "admin123";
    const defaultName = process.env.DEFAULT_NAME || "Administrator";

    const existingUser = await User.findOne({ username: defaultUsername });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      const user = new User({
        name: defaultName,
        username: defaultUsername,
        password: hashedPassword,
        role: "admin",
      });
      await user.save();
      console.log("✅ Default admin user created:");
      console.log(`   Username: ${defaultUsername}`);
      console.log(`   Password: ${defaultPassword}`);
      console.log(`   Name: ${defaultName}`);
    } else {
      console.log("ℹ️  Default admin user already exists.");
    }
  } catch (err) {
    console.error("❌ Error seeding default user:", err.message);
  }
}

// ========== AUTH MIDDLEWARE ==========
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token." });
  }
};

// ========== AUTH ROUTES ==========

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Get current user
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

// ========== PROTECT CUSTOMER ROUTES ==========
app.use("/api/customers", authMiddleware, customerRoutes);

// ========== SERVE FRONTEND ==========
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ========== DATABASE & SERVER ==========
mongoose
  .connect(process.env.MONGO)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    await seedDefaultUser();
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
