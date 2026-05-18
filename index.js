const express = require("express");
const cors = require("cors");
const db = require("./database");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Route dosyalarını içe aktar
const companyRoutes = require("./routes/companies");
const applicationRoutes = require("./routes/applications");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Swagger Arayüzü Rotası
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Route'larını tanımla
app.use("/api/companies", companyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes); // Auth rotalarını ekle

// Yüklenen CV'lere tarayıcıdan güvenli erişim ve zorunlu ekranda gösterme (inline) ayarı:
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda ayağa kalktı. http://localhost:${PORT}`);
});
