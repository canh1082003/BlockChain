const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// Khởi tạo express app
const app = express();
const PORT = 3000;

dotenv.config();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "public", "index.html");
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
