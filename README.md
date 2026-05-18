# İş ve Staj Başvuru Yöneticisi (CareerTrack)

## 📖 Proje Hakkında

Bu proje, Sistem Analizi ve Tasarımı dersi kapsamında geliştirilmiş, veri odaklı ve ilişkisel mimariye sahip tam yığın (full-stack) bir web uygulamasıdır. Yazılım mühendisliği prensipleri ve katmanlı mimari gözetilerek tasarlanan bu sistem, staj ve iş başvurularının profesyonel bir şekilde kayıt altına alınmasını, yönetilmesini ve takip edilmesini sağlar.

Sistem, "Şirketler (Companies)" ve "Başvurular (Applications)" olmak üzere iki ana varlık (entity) üzerinden **Bire-Çok (1-to-N)** ilişki modelini kullanarak çalışmaktadır.

## 🚀 Öne Çıkan Özellikler

- **İlişkisel Veritabanı Mimarisi:** Şirket kayıtları ile bu şirketlere yapılan başvurular arasında kurulan dinamik bağlantı.
- **Tam CRUD Desteği:** Her iki varlık (Şirket ve Başvuru) için listeleme, ekleme, güncelleme ve silme işlemleri.
- **Katmanlı Mimari (Modülerlik):** Route, Controller ve Service katmanlarının birbirinden tamamen izole edildiği temiz kod (Clean Code) yapısı.
- **Çift Taraflı Doğrulama (Validation):** Girdi verilerinin hem Vanilla JS arayüzünde hem de Node.js sunucusunda iş mantığı standartlarına göre doğrulanması.
- **SPA (Tek Sayfa Uygulaması):** Sayfa yenilenmesine gerek kalmadan, tamamen asenkron (Fetch API) çalışan dinamik Vanilla JS arayüzü.

## 🛠️ Teknoloji Yığını

- **Frontend:** Vanilla Javascript, HTML5, CSS3.
- **Backend:** Node.js, Express.js.
- **Veri Katmanı:** SQLite (Taşınabilirlik ve kolay yeniden üretilebilirlik için harici kurulum gerektirmeyen dosya tabanlı DBMS tercih edilmiştir).
- **API Mimarisi:** RESTful API standartları (JSON formatında iletişim).
- **Dokümantasyon:** Swagger UI (`swagger-ui-express`).
- **Test ve Güvenlik:** İş mantığı servisleri için Unit Test yapısı ve güvenlik/kalite denetimi için linter entegrasyonu.

## ⚙️ Sistem Kurulumu ve Yeniden Üretilebilirlik

Projenin başka bir yerel ortamda eksiksiz olarak ayağa kaldırılabilmesi (reproducibility) için veritabanı doğrudan proje içine entegre edilmiştir. Herhangi bir ekstra SQL sunucusu kurmanıza gerek yoktur.

Aşağıdaki adımları sırasıyla terminalinizde çalıştırarak projeyi başlatabilirsiniz:

1. **Depoyu Klonlayın:**
   ```bash
   git clone [https://github.com/Gulsmilee/careertrack.git](https://github.com/Gulsmilee/careertrack.git)
   cd careertrack
   ```
