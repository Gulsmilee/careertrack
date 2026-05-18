const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./careertrack.db", (err) => {
  if (err) {
    console.error("Veritabanına bağlanırken hata oluştu:", err.message);
  } else {
    console.log("SQLite veritabanına başarıyla bağlanıldı.");
  }
});

db.serialize(() => {
  // 1. Kullanıcılar Tablosu (YENİ)
  db.run(
    `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `,
    (err) => {
      if (err) console.error("Kullanıcılar tablosu hatası:", err.message);
      else console.log("Kullanıcılar (users) tablosu hazır.");
    },
  );

  // 2. Şirketler Tablosu (user_id eklendi)
  db.run(
    `
        CREATE TABLE IF NOT EXISTS companies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            industry TEXT,
            website TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `,
    (err) => {
      if (err) console.error("Şirketler tablosu hatası:", err.message);
      else console.log("Şirketler (companies) tablosu hazır.");
    },
  );

  // 3. Başvurular Tablosu (user_id eklendi)
  db.run(
    `CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    company_id INTEGER,
    position TEXT NOT NULL,
    status TEXT NOT NULL,
    application_date TEXT NOT NULL,
    interview_date TEXT,
    cv_path TEXT, -- YENİ: CV dosya adını tutacağımız sütun
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(company_id) REFERENCES companies(id))
    `,
    (err) => {
      if (err) console.error("Başvurular tablosu hatası:", err.message);
      else console.log("Başvurular (applications) tablosu hazır.");
    },
  );
});

module.exports = db;
