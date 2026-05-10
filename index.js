const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

//middleware'ler gelen json verilerini okumak ve cors için
app.use(cors());
app.use(express.json());

//test route'u
app.get("/", (req, res) => {
  res.json({ mesaj: "Rüya Günlüğü API'si başarıyla çalışıyor! 🌙 " });
});

//sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda ayağa kalktı. http://localhost:${PORT}`);
});
