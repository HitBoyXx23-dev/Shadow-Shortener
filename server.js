const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// 🌐 Your Render URL
const BASE_URL = "https://shadow-shortener.onrender.com";

// Persistent store
const DATA_FILE = "./data.json";
let urls = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : {};

// Word lists for random names
const adjectives = [
  "dark", "silent", "crimson", "shadow", "lunar", "void", "celestial", "fallen",
  "midnight", "abyssal", "arcane", "storm", "cosmic", "neon", "phantom", "glowing"
];
const nouns = [
  "flame", "soul", "dream", "realm", "mist", "hunter", "veil", "moon",
  "nova", "specter", "signal", "spark", "hollow", "echo", "rift", "vortex"
];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Generate random readable slugs like "shadow-veil"
function generateSlug() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  let slug = `${adj}-${noun}`;
  while (urls[slug]) slug = `${adj}-${noun}-${Math.floor(Math.random() * 99)}`;
  return slug;
}

// POST /shorten → creates short link
app.post("/shorten", (req, res) => {
  const { url, mode, customWord } = req.body;

  let slug;
  if (mode === "custom" && customWord) {
    slug = customWord.toLowerCase().replace(/\s+/g, "-");
    if (urls[slug]) return res.json({ error: "That word is already taken!" });
  } else {
    slug = generateSlug();
  }

  urls[slug] = url;
  fs.writeFileSync(DATA_FILE, JSON.stringify(urls, null, 2));

  res.json({ shortUrl: `${BASE_URL}/${slug}` });
});

// GET /:slug → redirects to original URL
app.get("/:slug", (req, res) => {
  const target = urls[req.params.slug];
  if (target) return res.redirect(target);
  res.status(404).send("⚠️ Shadow link not found.");
});

app.listen(PORT, () => console.log(`🌑 Shadow Shortener running at ${BASE_URL} (port ${PORT})`));
