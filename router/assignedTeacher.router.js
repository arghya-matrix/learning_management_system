const express = require("express");
const router = express.Router();
const tokenVerify = require("../middleware/tokenverify");
const assignedTeacherController = require("../controller/assignedTeacher.controller");

router.get(
  "/get-assigned-teacher",
  tokenVerify.userProfile,
  assignedTeacherController.getAssignedTeacher
);

module.exports = router