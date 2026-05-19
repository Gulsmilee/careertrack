const { expect } = require("chai");
const {
  applicationSchema,
  companySchema,
} = require("../services/validationService");

describe("İş Mantığı ve Doğrulama Servisi (Unit Tests)", () => {
  // ==========================================
  // A. BAŞVURU (APPLICATION) TESTLERİ (1-6)
  // ==========================================
  describe("A. Başvuru Verisi Kontrolleri", () => {
    it("1. Doğru verilerle gelen bir başvuruyu kabul etmeli (Başarılı Senaryo)", () => {
      const validData = {
        company_id: 1,
        position: "Product Owner",
        status: "Başvuruldu",
        application_date: "2026-05-19",
      };
      const { error } = applicationSchema.validate(validData);
      expect(error).to.be.undefined;
    });

    it("2. Pozisyon alanı 100 karakter sınırını aştığında reddetmeli (Karakter Sınırı Testi)", () => {
      const invalidData = {
        company_id: 1,
        position: "A".repeat(101),
        status: "Mülakat",
        application_date: "2026-05-19",
      };
      const { error } = applicationSchema.validate(invalidData);
      expect(error).to.not.be.undefined;
      expect(error.details[0].message).to.include(
        "length must be less than or equal to 100",
      );
    });

    it("3. Pozisyon alanı 2 karakterden kısa olduğunda reddetmeli (Min Karakter Testi)", () => {
      const invalidData = {
        company_id: 1,
        position: "X",
        status: "Kabul",
        application_date: "2026-05-19",
      };
      const { error } = applicationSchema.validate(invalidData);
      expect(error).to.not.be.undefined;
      expect(error.details[0].message).to.include("length must be at least 2");
    });

    it("4. Şirket seçilmediğinde (Boş Veri) sistemi durdurmalı", () => {
      const invalidData = {
        position: "Software Engineer",
        status: "Kabul",
        application_date: "2026-05-20",
      };
      const { error } = applicationSchema.validate(invalidData);
      expect(error).to.not.be.undefined;
      expect(error.details[0].context.key).to.equal("company_id");
    });

    it('5. Beklenmeyen bir başvuru durumu (Örn: "Bekliyor") gönderildiğinde reddetmeli (Enum Kısıtlama Testi)', () => {
      const invalidData = {
        company_id: 2,
        position: "Data Analyst",
        status: "Bekliyor",
        application_date: "2026-05-21",
      };
      const { error } = applicationSchema.validate(invalidData);
      expect(error).to.not.be.undefined;
      expect(error.details[0].message).to.include("must be one of");
    });

    it("6. Geçersiz bir tarih formatı girildiğinde reddetmeli (Tarih Formatı Testi)", () => {
      const invalidData = {
        company_id: 1,
        position: "Developer",
        status: "Başvuruldu",
        application_date: "19-Mayıs-2026", // Geçersiz metinsel tarih
      };
      const { error } = applicationSchema.validate(invalidData);
      expect(error).to.not.be.undefined;
      expect(error.details[0].message).to.include(
        "must be in ISO 8601 date format",
      );
    });
  });

  // ==========================================
  // B. ŞİRKET (COMPANY) TESTLERİ (7-10)
  // ==========================================
  describe("B. Şirket Verisi Kontrolleri", () => {
    it("7. Geçerli bir şirket verisi gönderildiğinde onay vermeli", () => {
      const validCompany = {
        name: "Tech Solutions A.Ş.",
        industry: "Yazılım",
        website: "https://techsolutions.com",
      };
      const { error } = companySchema.validate(validCompany);
      expect(error).to.be.undefined;
    });

    it("8. Şirket adı boş gönderildiğinde reddetmeli (Zorunlu Alan Testi)", () => {
      const invalidCompany = {
        industry: "Finans",
        website: "https://finance.com",
      };
      const { error } = companySchema.validate(invalidCompany);
      expect(error).to.not.be.undefined;
      expect(error.details[0].context.key).to.equal("name");
    });

    it("9. Web sitesi geçerli bir URL formatında değilse reddetmeli (URL Regex Testi)", () => {
      const invalidCompany = {
        name: "Aris Tech",
        website: "www.arishatalisite", // https:// protokolü yok
      };
      const { error } = companySchema.validate(invalidCompany);
      expect(error).to.not.be.undefined;
      expect(error.details[0].message).to.include("must be a valid uri");
    });

    it("10. Şirket adı 100 karakterden uzun olduğunda sistemi durdurmalı", () => {
      const invalidCompany = {
        name: "B".repeat(101),
      };
      const { error } = companySchema.validate(invalidCompany);
      expect(error).to.not.be.undefined;
      // Beklenen hatayı Joi'nin İngilizce varsayılanı yerine bizim yazdığımız Türkçe mesaja çevirdik
      expect(error.details[0].message).to.include(
        "Şirket adı en fazla 100 karakter",
      );
    });
  });
});
