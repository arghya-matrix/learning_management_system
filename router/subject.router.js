const express = require("express");
const router = express.Router();
const subjectController = require("../controller/subject.controller");
const subjectValidation = require("../middleware/subject.middleware");
const tokenVerify = require("../middleware/tokenverify");

router.post(
  "/create-subject",
  tokenVerify.userProfile,
  subjectValidation.validateSubject,
  subjectController.createSubject
);

router.get("/get-subject", subjectController.getSubject);
router.put(
  "/update-subject",
  tokenVerify.userProfile,
  subjectController.updateSubject
);

module.exports = router;
