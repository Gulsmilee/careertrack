const db = require("../database");

// 1. Sadece Kendi Başvurularını Listele (GET)
exports.getAllApplications = (req, res) => {
  // JOIN SORGUSU GÜNCELLENDİ: Sadece bu kullanıcıya ait başvuruları getir
  const sql = `
        SELECT applications.*, companies.name AS company_name 
        FROM applications 
        JOIN companies ON applications.company_id = companies.id
        WHERE applications.user_id = ?
    `;

  db.all(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ data: rows });
  });
};

// 2. Kendi Adına Başvuru Ekle (POST)
exports.createApplication = (req, res) => {
  const { company_id, position, status, application_date, interview_date } =
    req.body;

  if (!company_id || !position || !status || !application_date) {
    return res.status(400).json({ error: "Lütfen zorunlu alanları doldurun." });
  }

  // Şirket sahibinin de bu kullanıcı olduğunu doğrulamak profesyonel bir hamledir ama şimdilik doğrudan ekliyoruz
  const sql =
    "INSERT INTO applications (user_id, company_id, position, status, application_date, interview_date) VALUES (?, ?, ?, ?, ?, ?)";
  db.run(
    sql,
    [
      req.user.id,
      company_id,
      position,
      status,
      application_date,
      interview_date,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        mesaj: "Başvuru başarıyla eklendi.",
        data: { id: this.lastID },
      });
    },
  );
};

// 3. Sadece Kendi Başvurunu Güncelle (PUT)
exports.updateApplication = (req, res) => {
  const { position, status, interview_date } = req.body;
  const { id } = req.params;

  const sql =
    "UPDATE applications SET position = ?, status = ?, interview_date = ? WHERE id = ? AND user_id = ?";
  db.run(
    sql,
    [position, status, interview_date, id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res
          .status(404)
          .json({ error: "Başvuru bulunamadı veya yetkiniz yok." });
      res.status(200).json({ mesaj: "Başvuru detayları güncellendi." });
    },
  );
};

// 4. Sadece Kendi Başvurunu Sil (DELETE)
exports.deleteApplication = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM applications WHERE id = ? AND user_id = ?";
  db.run(sql, [id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res
        .status(404)
        .json({ error: "Başvuru bulunamadı veya yetkiniz yok." });
    res.status(200).json({ mesaj: "Başvuru sistemden silindi." });
  });
};
