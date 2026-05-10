# Rüya Günlüğü (Dream Diary) - Sistem Analizi ve Tasarımı Projesi

## 📖 Proje Hakkında

Bu proje, Sistem Analizi ve Tasarımı dersi kapsamında geliştirilmiş, veri odaklı web tabanlı bir CRUD uygulamasıdır. Kullanıcıların gördükleri rüyaları kaydetmelerine, güncellemelerine, silmelerine ve okumalarına olanak tanır. Girilen rüya metinleri üzerinden basit bir yapay zeka entegrasyonu ile rüyaların duygu durumuna göre (kabus, neşe, karmaşa vb.) otomatik etiketlenmesi sağlanmaktadır.

## 🚀 Özellikler

- **Tam CRUD İşlemleri:** Rüyaları ekleme, listeleme, detay görüntüleme, güncelleme ve silme.
- **Yapay Zeka Destekli Sınıflandırma:** Girilen rüya metninin AI yardımıyla duygu analizi ve etiketlenmesi.
- **Filtreleme ve Arama:** Rüyaları duygu etiketlerine göre dinamik olarak filtreleme.
- **Tek Sayfa Uygulaması (SPA):** Sayfa yenilenmeden asenkron (fetch API) veri iletişimi ile dinamik içerik yönetimi.

## 🛠️ Teknoloji Yığını

- **Frontend:** Vanilla Javascript, HTML5, CSS3. (React, Vue veya Angular gibi frameworkler kullanılmamıştır).
- **Backend:** Node.js, Express.
- **Veri Katmanı:** SQLite (DBMS serbesttir).
- **API Katmanı:** RESTful mimari, JSON tabanlı istek/cevap formatı.
- **Dokümantasyon:** Swagger UI.

## ⚙️ Kurulum Adımları

Projeyi kendi yerel ortamınızda (localhost) çalıştırarak yeniden üretmek için aşağıdaki adımları izleyin:

1. **Depoyu Klonlayın:**
   ```bash
   git clone [https://github.com/](https://github.com/)gulsmilee/ruya-gunlugu.git
   cd ruya-gunlugu
   ```
