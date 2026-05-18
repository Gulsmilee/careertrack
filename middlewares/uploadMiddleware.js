const multer = require("multer");
const path = require("path");

// Dosyanın nereye ve hangi isimle kaydedileceği
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Ana dizindeki uploads klasörü
  },
  filename: function (req, file, cb) {
    // İsim çakışmasını önlemek için: kullaniciID-tarih.pdf
    cb(null, req.user.id + "-" + Date.now() + path.extname(file.originalname));
  },
});

// Dosya Filtresi (Sadece PDF Kuralı)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Sadece PDF formatında CV yükleyebilirsiniz!"), false);
  }
};

// Multer Ayarlarını Toparlama (2MB Sınırı)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB sınırı
  },
  fileFilter: fileFilter,
});

module.exports = upload;
