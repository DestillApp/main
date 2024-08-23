//secure coooooooooookie
// middleware/auth.js (continued)
const jwt = require("jsonwebtoken");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

// On login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await database.findUserByUsername(username);

  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// On logout
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});
