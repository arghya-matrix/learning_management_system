const express = require("express");
const router = express.Router();
const classValidation = require("../middleware/classes.middleware");
const classController = require("../controller/class.controller");
const tokenVerify = require("../middleware/tokenverify");

router.post(
  "/create-class",
  tokenVerify.userProfile,
  classValidation.classesValidation,
  classController.createClass
);
router.get("/get-class", tokenVerify.userProfile, classController.getClasses);

module.exports = router;
