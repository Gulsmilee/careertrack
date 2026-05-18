const { expect } = require("chai");
const { applicationSchema } = require("../services/validationService");

describe("Başvuru Doğrulama İş Mantığı (Unit Tests)", () => {
  it("1. Doğru verilerle gelen bir başvuruyu kabul etmeli (Başarılı Senaryo)", () => {
    const validData = {
      company_id: 1,
      position: "Product Owner", // Hedefindeki rolü test ediyoruz :)
      status: "Başvuruldu",
      application_date: "2026-05-19",
    };
    const { error } = applicationSchema.validate(validData);
    // Error undefined olmalı, yani hata çıkmamalı
    expect(error).to.be.undefined;
  });

  it("2. Pozisyon alanı 100 karakter sınırını aştığında Joi kalkanı reddetmeli (Karakter Sınırı Testi)", () => {
    const longPosition = "A".repeat(101); // 101 karakterli uç sınır
    const invalidData = {
      company_id: 1,
      position: longPosition,
      status: "Mülakat",
      application_date: "2026-05-19",
    };
    const { error } = applicationSchema.validate(invalidData);
    expect(error).to.not.be.undefined;
    expect(error.details[0].message).to.include(
      "length must be less than or equal to 100",
    );
  });

  it("3. Şirket seçilmediğinde sistemi durdurmalı (Boş Veri Testi)", () => {
    const missingCompanyData = {
      position: "Software Engineer",
      status: "Kabul",
      application_date: "2026-05-20",
    };
    const { error } = applicationSchema.validate(missingCompanyData);
    expect(error).to.not.be.undefined;
    expect(error.details[0].context.key).to.equal("company_id");
  });

  it('4. Beklenmeyen bir başvuru durumu (Örn: "Bekliyor") gönderildiğinde reddetmeli (Enum Kısıtlama Testi)', () => {
    const invalidStatusData = {
      company_id: 2,
      position: "Data Analyst",
      status: "Bekliyor", // Senin valid() kuralında sadece Başvuruldu, Mülakat, Kabul, Red var
      application_date: "2026-05-21",
    };
    const { error } = applicationSchema.validate(invalidStatusData);
    expect(error).to.not.be.undefined;
    expect(error.details[0].message).to.include("must be one of");
  });
});
