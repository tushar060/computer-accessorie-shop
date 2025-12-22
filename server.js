const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/accessoriesDB");

const Enquiry = mongoose.model("Enquiry", {
  name: String,
  email: String,
  product: String,
  message: String,
  date: String
});

// Save enquiry
app.post("/enquiry", async (req, res) => {
  const enquiry = new Enquiry({
    ...req.body,
    date: new Date().toLocaleString()
  });
  await enquiry.save();
  res.json({ message: "Enquiry stored in MongoDB!" });
});

// Admin view
app.get("/admin/enquiries", async (req, res) => {
  const data = await Enquiry.find();
  res.json(data);
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
