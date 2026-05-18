const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const verifyToken = require("../middlewares/authMiddleware");
const { validate, companySchema } = require("../services/validationService");

router.get("/", verifyToken, companyController.getAllCompanies);
// Veri veritabanına yazılmadan önce 'validate(companySchema)' kontrolünden geçer!
router.post(
  "/",
  verifyToken,
  validate(companySchema),
  companyController.createCompany,
);
router.put(
  "/:id",
  verifyToken,
  validate(companySchema),
  companyController.updateCompany,
);
router.delete("/:id", verifyToken, companyController.deleteCompany);

module.exports = router;
