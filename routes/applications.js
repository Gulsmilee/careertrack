const express = require("express");
const multer = require("multer");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const verifyToken = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
  validate,
  applicationSchema,
} = require("../services/validationService");

router.get("/", verifyToken, applicationController.getAllApplications);
router.post(
  "/",
  verifyToken,
  validate(applicationSchema),
  applicationController.createApplication,
);
router.put(
  "/:id",
  verifyToken,
  validate(applicationSchema),
  applicationController.updateApplication,
);
router.delete("/:id", verifyToken, applicationController.deleteApplication);

// YENİ: CV Yükleme Rotası (Hem kimlik doğrular, hem PDF/Boyut kontrolü yapar)
// Gelişmiş CV Yükleme Rotası (Hata Yakalama Korumalı)
router.post("/:id/upload-cv", verifyToken, (req, res) => {
  // Yükleme işlemini burada manuel tetikliyoruz ki hataları biz yakalayabilelim
  upload.single("cv")(req, res, function (err) {
    // 1. Kural İhlali: Multer sınırları aşıldıysa (Örn: Dosya 2MB'den büyükse)
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({
          error:
            "Dosya çok büyük. Lütfen maksimum 2MB boyutunda bir PDF yükleyin.",
        });
    }
    // 2. Kural İhlali: Bizim yazdığımız PDF format filtresine takıldıysa
    else if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Dosya seçilmeden butona basıldıysa
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Lütfen geçerli bir PDF dosyası seçin." });
    }

    // Kısıtlamaları geçtiyse veritabanına kaydet
    const applicationId = req.params.id;
    const userId = req.user.id;
    const fileName = req.file.filename;

    const db = require("../database");
    const sql =
      "UPDATE applications SET cv_path = ? WHERE id = ? AND user_id = ?";

    db.run(sql, [fileName, applicationId, userId], function (dbErr) {
      if (dbErr) {
        return res.status(500).json({ error: dbErr.message });
      }
      if (this.changes === 0) {
        return res
          .status(403)
          .json({ error: "Yetkisiz işlem veya başvuru bulunamadı." });
      }

      res.status(200).json({
        mesaj: "CV başarıyla kaydedildi.",
        dosyaAdi: fileName,
      });
    });
  });
});
// Multer kısıtlamalarına (Boyut, Format) takılanlar için hata yakalayıcı
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

module.exports = router;
