const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

// Memory store for short links
const urls = {};

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Shorten route
app.post("/shorten", (req, res) => {
  const { url } = req.body;
  const code = crypto.randomBytes(3).toString("hex");
  urls[code] = url;
  res.json({ shortUrl: `${req.protocol}://${req.get("host")}/${code}` });
});

// Redirect route
app.get("/:code", (req, res) => {
  const code = req.params.code;
  const target = urls[code];
  if (target) return res.redirect(target);
  res.status(404).send("⚠️ Shadow link not found.");
});

app.listen(PORT, () => console.log(`🌑 Shadow Shortener running on port ${PORT}`));
