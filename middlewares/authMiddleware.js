const jwt = require("jsonwebtoken");

// authController'da kullandığımız anahtarın BİREBİR aynısı olmalı
const SECRET_KEY = "careertrack_gizli_anahtar";

module.exports = (req, res, next) => {
  // İstemciden (Frontend) gelen isteğin başlığında (headers) yetki belgesi var mı?
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Yetkisiz erişim. Lütfen giriş yapın." });
  }

  // "Bearer <token_kodu>" şeklindeki metinden sadece token kısmını ayırıyoruz
  const token = authHeader.split(" ")[1];

  // Token sahte mi veya süresi dolmuş mu diye kontrol ediyoruz
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ error: "Geçersiz veya süresi dolmuş oturum." });
    }

    // Şifre çözüldü! Kullanıcının ID'sini (decoded.id) isteğin (req) içine gömüyoruz.
    // Bu sayede Controller tarafında 'req.user.id' yazarak bu kişinin kim olduğunu bileceğiz!
    req.user = decoded;
    next(); // Kimlik geçerli, asıl rotaya gitmesine izin ver.
  });
};
