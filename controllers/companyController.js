const db = require("../database");

// 1. Sadece Kendi Şirketlerini Listele (GET)
exports.getAllCompanies = (req, res) => {
  // SORGUDAN KİMİ FİLTRELİYORUZ: Sadece token'dan gelen user_id'ye ait şirketler
  const sql = "SELECT * FROM companies WHERE user_id = ?";

  db.all(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ data: rows });
  });
};

// 2. Kendi Adına Şirket Ekle (POST)
exports.createCompany = (req, res) => {
  const { name, industry, website } = req.body;
  if (!name)
    return res.status(400).json({ error: "Şirket adı (name) zorunludur." });

  // user_id'yi token'dan (req.user.id) alıp doğrudan veritabanına yazıyoruz
  const sql =
    "INSERT INTO companies (user_id, name, industry, website) VALUES (?, ?, ?, ?)";
  db.run(sql, [req.user.id, name, industry, website], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res
      .status(201)
      .json({ mesaj: "Şirket başarıyla eklendi", data: { id: this.lastID } });
  });
};

// 3. Sadece Kendi Şirketini Güncelle (PUT)
exports.updateCompany = (req, res) => {
  const { name, industry, website } = req.body;
  const { id } = req.params;

  // GÜVENLİK: Sadece "bu id'ye sahip VE user_id'si bana ait olan" şirketi güncelle
  const sql =
    "UPDATE companies SET name = ?, industry = ?, website = ? WHERE id = ? AND user_id = ?";
  db.run(sql, [name, industry, website, id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res
        .status(404)
        .json({ error: "Şirket bulunamadı veya yetkiniz yok." });
    res.status(200).json({ mesaj: "Şirket başarıyla güncellendi." });
  });
};

// 4. Sadece Kendi Şirketini Sil (DELETE)
exports.deleteCompany = (req, res) => {
  const { id } = req.params;

  // GÜVENLİK: user_id kontrolü ile başkasının verisini silmeyi engelliyoruz
  const sql = "DELETE FROM companies WHERE id = ? AND user_id = ?";
  db.run(sql, [id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res
        .status(404)
        .json({ error: "Şirket bulunamadı veya yetkiniz yok." });
    res
      .status(200)
      .json({ mesaj: "Şirket ve ona bağlı tüm başvurular silindi." });
  });
};
