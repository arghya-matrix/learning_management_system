const userController = require("../controller/user.controller");
const userValidation = require("../middleware/validateUser");
const tokenVerify = require("../middleware/tokenverify");
const passwordHashing = require("../middleware/hashing");
const express = require("express");
const router = express.Router();

router.post(
  "/sign-up",
  [
    userValidation.checkExistingUser,
    userValidation.validateEmail,
    userValidation.validatePassword,
    userValidation.validateUser,
    passwordHashing.hashPassword,
  ],
  userController.signUp
);

router.post(
  "/sign-in",
  [userValidation.validateEmail, userValidation.userApprovedOrNot],
  userController.signIn
);

router.put("/update", tokenVerify.userProfile, userController.updateUser);
router.put(
  "/approve-status",
  [tokenVerify.userProfile, userValidation.approveStatusValidation],
  userController.approveStatus
);
router.put("/assign-new-grade",tokenVerify.userProfile)

module.exports = router;
