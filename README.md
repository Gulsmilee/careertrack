# 🚀 CareerTrack - Modern İş ve Staj Başvuru Yönetim Sistemi

Bu proje, **Sistem Analizi ve Tasarımı Dersi** kapsamında geliştirilmiş, katmanlı mimari (Layered Architecture) prensiplerine uygun, RESTful API tabanlı bir CRUD uygulamasıdır.

Kullanıcıların kariyer hedeflerini, iş ve staj başvurularını, firma mülakat süreçlerini tek bir platformdan, veri izolasyonu güvenliğiyle takip etmelerini sağlar.

👤 **Geliştirici:** Gülbahar Doğan

---

## 📋 Proje Gereksinimleri Karşılama Raporu

Bu proje, ders kapsamında belirtilen tüm isterleri aşağıdaki şekilde eksiksiz olarak karşılamaktadır:

- ✅ **Vanilla JS ile Tek Sayfa Uygulaması (SPA):** Projede React, Vue vb. frameworkler _kesinlikle kullanılmamıştır_. Arayüz tamamen Vanilla JavaScript ile inşa edilmiş olup, DOM manipülasyonu ve `fetch` API ile sayfa **hiç yenilenmeden** asenkron çalışmaktadır.
- ✅ **Katmanlı Mimari ve İş Mantığı İzolasyonu:** İş mantığı (Business Logic) Express rotalarının içine yazılmamış, `services/validationService.js` dosyasına izole edilerek katmanlı mimari kuralına tam uyum sağlanmıştır.
- ✅ **Unit Test (Birim Testi):** İzole edilen iş mantığı için `Mocha` ve `Chai` kütüphaneleriyle kapsamlı unit testler yazılmıştır. 100 karakter sınırını aşma, boş veri gönderme veya geçersiz durum (enum) girme gibi uç senaryoların sistem tarafından nasıl engellendiği test edilmiştir. Boş test yoktur.
- ✅ **Çift Taraflı Validasyon (Frontend & Backend):** - _Client-side:_ Formlarda `required`, `minlength`, `type="email"`, `type="url"` gibi HTML5 güvenlik katmanları kullanılmıştır.
  - _Server-side:_ Backend'e gelen her istek `Joi` kütüphanesi ile şema kontrolünden (karakter limitleri, tip kontrolleri) geçirilmektedir.
- ✅ **Kimlik Doğrulama ve Veri İzolasyonu:** Sistem JWT (JSON Web Token) ve bcrypt ile korunmaktadır. Kullanıcı arayüzüne gereksiz hassas veri (şifre vb.) gönderilmez. SQL sorgularındaki `WHERE user_id = ?` izolasyonu sayesinde hiçbir kullanıcı başkasının verisini göremez veya silemez.
- ✅ **Dosya Yükleme Kısıtlamaları:** Başvurulara özel CV yükleme alanı `multer` kullanılarak file sisteme (uploads/ klasörü) entegre edilmiştir. Bu alana **sadece PDF** formatında ve **maksimum 2 MB** boyutunda dosya yüklenebilmesi için katı kısıtlamalar eklenmiştir.
- ✅ **İlişkisel Veritabanı ve Raw SQL:** Veritabanı işlemleri için ORM kullanılmamış, SQL hakimiyetini göstermek adına `sqlite3` ile saf (raw) SQL sorguları yazılmıştır. Sistemde Şirket (Parent) ve Başvuru (Child) arasında 1-to-N ilişkisi bulunmaktadır.
- ✅ **Ekstra Özellik (Arama/Filtreleme):** Sistemde kayıtlı veriler arasında anında (real-time) arama yapmayı sağlayan Vanilla JS tabanlı bir arama motoru bulunmaktadır.

---

## 🛠️ Kullanılan Teknolojiler (Tech Stack)

### Backend

- **Node.js & Express.js** (REST API)
- **SQLite3** (Veritabanı - Raw SQL)
- **Joi** (Veri Doğrulama ve Kısıtlama)
- **Multer** (Dosya Yükleme Motoru)
- **Bcrypt & JSON Web Token** (Şifreleme ve Oturum Yönetimi)
- **Swagger UI Express** (API Dokümantasyonu)

### Frontend

- **Vanilla JavaScript** (DOM Manipülasyonu)
- **HTML5 & CSS3** - **Bootstrap 5** (Buzlu Cam / Glassmorphism UI Tasarımı)

### Test

- **Mocha & Chai** (İş Mantığı / Birim Testleri)

---

## ⚙️ Sistem Kurulumu ve Yeniden Üretim (How to Run)

Projeyi yerel makinenizde çalıştırmak için Node.js'in (v18+) kurulu olması gerekmektedir.

**1. Projeyi Klonlayın veya ZIP'ten Çıkarın:**

```bash
git clone [https://github.com/Gulsmilee/careertrack.git](https://github.com/Gulsmilee/careertrack.git)
cd careertrack


```

**2. Gerekli Kütüphaneleri Kurun:**

```bash
npm install
```

**3. Çevresel Değişkenleri (.env) Ayarlayın:**
Proje ana dizininde bir .env dosyası oluşturun ve içine şu bilgileri ekleyin:

```bash
Kod snippet'i
PORT=3000
JWT_SECRET=careertrack_gizli_anahtari_2026
```

\*\*4. Sunucuyu Başlatın:

# Geliştirme (Development) modu için:

```bash
npm run dev
'''
```

# Veya standart başlatma:

```bash
npm start
```

Not: Sunucu başlatıldığında careertrack.db veritabanı dosyası ve gerekli ilişkisel tablolar otomatik olarak oluşturulacaktır.
'''
\*\*5. Sisteme Giriş:

```bash
Tarayıcınızı açın ve http://localhost:3000 adresine gidin.
'''
```

🧪 Unit Test (Birim Testleri) Nasıl Çalıştırılır?
Projeye ait iş mantığı testlerini (karakter sınırları, geçersiz veri girişleri) görmek için terminalde şu komutu çalıştırmanız yeterlidir:

```bash
npm test
```

Bu komut, Mocha framework'ünü tetikleyecek ve test/validationService.test.js dosyasındaki uç senaryoların başarıyla engellendiğini konsola yazdıracaktır.

## 📚 API Dokümantasyonu (Swagger)

Projede geliştirilen tüm RESTful endpoint'lerin detayları, aldığı parametreler ve dönüş tipleri Swagger kullanılarak dokümante edilmiştir.
Sunucu çalışırken interaktif API test ekranına ulaşmak için:

```bash
👉 http://localhost:3000/api-docs
```

## 📂 Proje Klasör Yapısı

```bash
Plaintext
careertrack/
├── public/                 # Vanilla JS, CSS ve HTML dosyaları (Frontend SPA)
├── routes/                 # Express.js REST API rotaları (Auth, Companies, Applications)
├── services/               # İzole edilmiş iş mantığı (Business Logic ve Validasyonlar)
├── test/                   # Mocha/Chai Birim testleri
├── uploads/                # Kullanıcıların yüklediği CV (PDF) dosyaları
├── database.js             # SQLite veritabanı bağlantısı ve tablo oluşturma (Raw SQL)
├── index.js                # Ana sunucu konfigürasyonu ve Middleware'ler
├── package.json            # Bağımlılıklar ve npm scriptleri
└── README.md               # Proje dokümantasyonu
```
