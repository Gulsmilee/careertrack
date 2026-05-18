const Joi = require("joi");

// Şirket Doğrulama Kuralları
const companySchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.max": "Şirket adı en fazla 100 karakter olabilir.",
    "any.required": "Şirket adı zorunludur.",
  }),
  industry: Joi.string().max(50).allow("", null),
  website: Joi.string().uri().max(255).allow("", null),
});

// Başvuru Doğrulama Kuralları
const applicationSchema = Joi.object({
  company_id: Joi.number().integer().required(),
  position: Joi.string().min(2).max(100).required(),
  status: Joi.string()
    .valid("Başvuruldu", "Mülakat", "Kabul", "Red")
    .required(),
  application_date: Joi.date().iso().required(),
  interview_date: Joi.date().iso().allow("", null),
});

// Gelen isteği kurallara göre test eden Middleware Fonksiyonu
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      // Kural ihlali varsa sunucuya gitmeden (400 Bad Request) hatası fırlat
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

module.exports = { companySchema, applicationSchema, validate };
