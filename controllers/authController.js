const db = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const SECRET_KEY = "careertrack_gizli_anahtar";

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// 1. KAYIT OLMA (REGISTER)
exports.register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.run(sql, [username, email, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res
            .status(400)
            .json({ error: "Bu kullanıcı adı veya e-posta zaten kullanımda." });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ mesaj: "Kayıt başarılı. Lütfen giriş yapın." });
    });
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası oluştu." });
  }
};

// 2. GİRİŞ YAPMA (LOGIN)
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "E-posta ve şifre zorunludur." });

  const sql = "SELECT * FROM users WHERE email = ?";
  db.get(sql, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Hatalı şifre." });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "2h" },
    );

    res.status(200).json({
      mesaj: "Giriş başarılı.",
      token: token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  });
};

// 3. ŞİFRE SIFIRLAMA (E-postasız Simülasyon)
exports.resetPassword = (req, res) => {
  const { username, email, newPassword } = req.body;

  if (!username || !email || !newPassword) {
    return res.status(400).json({ error: "Lütfen tüm alanları doldurun." });
  }

  const sql = "SELECT * FROM users WHERE username = ? AND email = ?";
  db.get(sql, [username, email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!user) {
      return res
        .status(404)
        .json({ error: "Kullanıcı adı veya e-posta eşleşmiyor." });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const updateSql = "UPDATE users SET password = ? WHERE id = ?";
      db.run(updateSql, [hashedPassword, user.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ mesaj: "Şifreniz başarıyla güncellendi." });
      });
    } catch (error) {
      res.status(500).json({ error: "Şifre şifrelenirken hata oluştu." });
    }
  });
};
