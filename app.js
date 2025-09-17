const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // serves public/index.html

// ================= MongoDB Config =================
const mongoURL = "mongodb://root:pass123@mongo:27017/testdb?authSource=admin";

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("âœ… Connected to MongoDB"))
  .catch(err => console.error("âŒ MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  name: String,
  surname: String
});

const User = mongoose.model("User", userSchema);

// ================= Routes =================

// Save user
app.post("/save-user", async (req, res) => {
  const { name, surname } = req.body;

  try {
    const user = new User({ name, surname });
    const savedUser = await user.save();
    res.send(`
      <h2>âœ… User saved! ID: ${savedUser._id}</h2>
      <a href="/users">View All Users</a><br>
      <a href="/">Go Back</a>
    `);
  } catch (err) {
    console.error("âŒ Insert error:", err);
    res.status(500).send("Error inserting data");
  }
});

// List all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    let table = `
      <h2>í±¥ Users List</h2>
      <table border="1" cellpadding="8" cellspacing="0">
        <tr><th>ID</th><th>Name</th><th>Surname</th></tr>
    `;
    users.forEach(u => {
      table += `<tr><td>${u._id}</td><td>${u.name}</td><td>${u.surname}</td></tr>`;
    });
    table += "</table><br><a href='/'>Go Back</a>";
    res.send(table);
  } catch (err) {
    console.error("âŒ Fetch error:", err);
    res.status(500).send("Error fetching users");
  }
});

// Start server
app.listen(3000,'0.0.0.0', () => console.log("íº€ Server running on http://localhost:3000"));

