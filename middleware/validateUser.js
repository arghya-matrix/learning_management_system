const { Op, where } = require("sequelize");
const userServices = require("../services/user.services");
const db = require("../models/index");

const validateUser = async function (req, res, next) {
  const data = req.body;
  const regex = /^[A-Za-z]+(?: [A-Za-z]+)? [A-Za-z]+$/;
  if (data.user_type == "Admin") {
    res.status(403).json({
      message: `Select user type as Student and Teacher Only`,
    });
    return;
  }
  if (data.user_type !== "Teacher" && data.user_type !== "Student") {
    res.status(403).json({
      message: "User type should be Teacher or Student",
    });
    return;
  }
  if (data.Name) {
    if (data.Name == " " || data.Name == null || data.Name == undefined) {
      res.status(422).json({
        message: "Invalid Name",
      });
      return;
    }
    if (!regex.test(data.Name)) {
      res.status(400).json({
        message: `Invalid Name`,
      });
      return;
    }
  }
  next();
};

const validateEmail = async function (req, res, next) {
  const email = req.body.email_address;
  const regex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}/;
  if (!regex.test(email)) {
    res.status(400).json({
      message: "Invalid email format",
    });
    return;
  }
  next();
};

async function checkExistingUser(req, res, next) {
  const whereOptions = {};
  whereOptions.email_address = req.body.email_address;
  const user = await userServices.findUser({
    whereOptions: whereOptions,
  });
  if (user.count > 0) {
    res.status(409).json({
      message: "user already signed up",
    });
    return;
  }
  next();
}

async function validatePassword(req, res, next) {
  const regex = /^[^\s]*$/;
  const password = req.body.password;

  if (!regex.test(password)) {
    let errorMessage = "Password must meet the following criteria:\n";
    errorMessage += "1. Start with an uppercase letter.\n";
    errorMessage += "2. Contain at least three digits.\n";
    errorMessage += "3. Include at least one special character.\n";
    errorMessage += "4. Be at least 7 characters long.";

    res.status(400).json({
      message: errorMessage,
    });
    return;
  } else {
    next();
  }
}

async function userApprovedOrNot(req, res, next) {
  const whereOptions = {};
  whereOptions.email_address = req.body.email_address;

  const user = await userServices.findUser({
    whereOptions: whereOptions,
  });
  const data = user.rows[0];

  if (user.count == 0) {
    res.json({
      message: `Sign up to log in`,
    });
    return;
  }

  if (data.user_type == "Admin" || data.user_type == "Student") {
    next();
  }
  if (data.user_type == "Teacher") {
    if (data.approved_stat == true) {
      next();
    } else {
      res.json({
        message: `Wait till admin approves your request`,
      });
      return;
    }
  }
}

async function approveStatusValidation(req, res, next) {
  let stat;
  if (req.body.approved_stat == "Accept") {
    stat = true;
  }
  if (req.body.approved_stat == "Reject") {
    stat = false;
  }
  if (!req.body.user_id) {
    res.status(403).json({
      message: `User id is required to approve an user`,
    });
    return;
  }
  if (req.userdata.type !== "Admin") {
    res.status(401).json({
      message: `Only Admin can approve this`,
    });
    return;
  }
  const whereOptions = {};
  whereOptions.id = req.body.user_id;
  whereOptions.user_type = "Teacher";
  whereOptions.approved_stat = { [Op.ne]: stat };
  const user = await userServices.findOneUser({
    whereOptions: whereOptions,
  });
  if (user.count > 0) {
    next();
  } else {
    res.status(409).json({
      message: `User id sent is not a Teacher or already ${req.body.approved_stat}ed`,
    });
  }
}

module.exports = {
  validateUser,
  validateEmail,
  checkExistingUser,
  validatePassword,
  userApprovedOrNot,
  approveStatusValidation,
};
