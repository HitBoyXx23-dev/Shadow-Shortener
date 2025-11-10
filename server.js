const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "https://shadow.ly";

const DATA_FILE = "./data.json";
let urls = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : {};

// Shadow-style words
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

function generateSlug() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  let slug = `${adj}-${noun}`;
  while (urls[slug]) slug = `${adj}-${noun}-${Math.floor(Math.random() * 99)}`;
  return slug;
}

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

app.get("/:slug", (req, res) => {
  const target = urls[req.params.slug];
  if (target) return res.redirect(target);
  res.status(404).send("⚠️ Shadow link not found.");
});

app.listen(PORT, () =>
  console.log(`🌑 Shadow Shortener running at ${BASE_URL} (port ${PORT})`)
);
