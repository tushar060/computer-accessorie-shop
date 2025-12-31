const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/accessoriesDB");

// User Schema
const User = mongoose.model("User", {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } // In production, hash this!
});

// Enquiry Schema with Cart
const Enquiry = mongoose.model("Enquiry", {
  name: String,
  email: String,
  product: String, // Kept for backward compatibility or single item enquiry
  message: String,
  cart: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalAmount: Number,
  date: String
});

// Register
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.json({ success: true, message: "User registered!" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Registration failed. Email might be taken." });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.json({ success: true, message: "Login successful!" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials." });
  }
});

// Save enquiry
app.post("/enquiry", async (req, res) => {
  const enquiry = new Enquiry({
    ...req.body,
    date: new Date().toLocaleString()
  });
  await enquiry.save();
  res.json({ message: "Enquiry sent with order details!" });
});

// Admin view
app.get("/admin/enquiries", async (req, res) => {
  const data = await Enquiry.find();
  res.json(data);
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
