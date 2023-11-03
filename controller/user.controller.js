const userServices = require("../services/user.services");
const sessionsServices = require("../services/sessions.services");
const hashingServices = require("../services/hashing.services");
const generateNumber = require("../services/generateNumber");
const jwtServices = require("../services/jwt.services");

const mailer = require("../middleware/mailer");
const { Op } = require("sequelize");
const db = require("../models/index");
const subjectServices = require("../services/subject.services");
const assignTeacherServices = require('../services/assignedTeacher.services');

async function signUp(req, res) {
  try {
    const stringWithSpaces = req.body.Name.toLowerCase();
    const userName = stringWithSpaces.replace(/\s/g, "");
    const number = generateNumber();
    const createObject = {};

    (createObject.Name = req.body.Name),
      (createObject.email_address = req.body.email_address);
    createObject.user_type = req.body.user_type
      ? req.body.user_type
      : "Student";
    if (req.body.user_type == "Teacher") {
      if (!req.body.subject_choice) {
        res.status(403).json({
          message: `Enter subject choice to sign up`,
        });
        return;
      }
    } 
    createObject.preferred_sub = req.body.subject_choice;

    createObject.approved_stat =
      req.body.user_type === "Teacher" ? false : true;

    createObject.user_name = userName.concat(number);
    createObject.password = req.password;

    const user = await userServices.createUser({
      createObject: createObject,
    });
    if (user.user_type == "Teacher") {
      let createTable;
      if (Array.isArray(req.body.grade) == true) {
        createTable = req.body.grade.map((id) => ({
          grade: id,
          subject_id: req.body.subject_choice,
          teacher_id: user.id,
        }));
      }
      await assignTeacherServices.assignTeacher({
        createTable:createTable
      })
    }
    const admin = await userServices.getAdmin();
    if (!admin) {
      res.json({
        message: `Create admin at first`,
      });
      return;
    }
    if (user.user_type == "Teacher" || user.user_type == "Student") {
      await mailer.sendMailToAdmin({
        user: user,
        Admin: admin,
      });
      await mailer.sendMailToUserOnSignUp({
        Admin: admin,
        user: user,
      });
    }
    res.status(200).json({
      message: `${req.body.email_address} created`,
      data: user,
    });
  } catch (error) {
    console.log(error, "<--- Error creating user");
    res.status(500).json({
      message: `Internal error`,
    });
  }
}

async function signIn(req, res) {
  try {
    const data = req.body;
    const whereOptions = {};
    whereOptions.email_address = data.email_address;
    const user = await userServices.findUser({
      whereOptions: whereOptions,
    });
    const dbUser = user.rows[0];
    // console.log(dbUser);
    // console.log(data);

    if (user.count == 0) {
      res.json({
        message: `!!!!You are not Signed Up!!!!`,
      });
    } else if (data.email_address == dbUser.email_address) {
      const result = await hashingServices.checkPassword({
        hash: dbUser.password,
        password: data.password,
      });

      if (result == true) {
        const findSession = await sessionsServices.findSessionByUserId({
          user_id: dbUser.id,
        });

        if (findSession.count <= 0) {
          const sessions = await sessionsServices.createSession({
            user_id: dbUser.id,
          });
          const jwt = jwtServices.createToken({
            sessions_id: sessions.id,
            user_id: dbUser.id,
            user_name: dbUser.user_name,
            type: dbUser.user_type,
          });
          const authData = jwtServices.verifyToken(jwt);

          // console.log(authData, "<---- Auth data");
          const expDate = new Date(authData.exp * 1000);
          const iatDate = new Date(authData.iat * 1000);

          await sessionsServices.updateSession({
            expiry_date: expDate,
            login_date: iatDate,
            sessions_id: authData.sessions_id,
          });

          const userdata = user.rows[0];
          delete userdata.password;
          // delete userdata.user_id;
          // console.log(userdata,"Profile details in User controller");

          res.json({
            message: "Logged In",
            Profile: userdata,
            JWTtoken: jwt,
          });
        } else {
          const currentDate = new Date();
          // console.log(findSession.rows,"<<-Session data");
          const data = findSession.rows[0];
          await sessionsServices.updateExistingSession({
            expiry_date: currentDate,
            logout_date: currentDate,
            sessions_id: data.id,
          });

          const sessions = await sessionsServices.createSession({
            user_id: dbUser.id,
          });
          const jwt = jwtServices.createToken({
            sessions_id: sessions.id,
            user_id: dbUser.id,
            user_name: dbUser.user_name,
            type: dbUser.user_type,
          });
          const authData = jwtServices.verifyToken(jwt);
          const expDate = new Date(authData.exp * 1000);
          const iatDate = new Date(authData.iat * 1000);

          await sessionsServices.updateSession({
            expiry_date: expDate,
            login_date: iatDate,
            sessions_id: authData.sessions_id,
          });

          const userdata = user.rows[0];
          delete userdata.password;

          res.json({
            message: "Logged In",
            Profile: userdata,
            JWTtoken: jwt,
          });
        }
      } else if (result == false) {
        return res.status(401).json({
          message: `Wrong password`,
        });
      }
    } else {
      res.json({
        message: "Invalid Email Address",
      });
    }
  } catch (error) {
    console.log(error, "<-----Error???>>>>>");
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function updateUser(req, res) {
  const data = req.body;
  const updateOptions = {};
  const whereOptions = {};
  whereOptions.id = req.userdata.user_id;

  if (data.Name) {
    updateOptions.Name = data.Name;
  }
  if (data.email_address) {
    updateOptions.email_address = data.email_address;
  }
  const user = await userServices.updateUser({
    updateOptions: updateOptions,
    whereOptions: whereOptions,
  });
  if (user.statuscode == 200) {
    res.status(200).json({
      message: user.message,
      data: user.data,
    });
  }
  if (user.statuscode == 500) {
    res.status(500).json({
      message: user.message,
      error: user.error,
    });
  }
}

async function approveStatus(req, res) {
  const updateOptions = {};
  const whereOptions = {};
  if (req.body.approved_stat == "Accept") {
    updateOptions.approved_stat = true;
  }
  if (req.body.approved_stat == "Reject") {
    updateOptions.approved_stat = false;
  }
  whereOptions.id = req.body.user_id;
  const data = await userServices.updateUser({
    updateOptions: updateOptions,
    whereOptions: whereOptions,
  });
  
  if (data.statuscode == 200) {
    const whereObject = {};
    const updateObject = {};
    const user = data.data;
    whereObject.id = user.preferred_sub;
    updateObject.No_of_Teachers_now = db.sequelize.literal(
      `No_of_Teachers_now+${1}`
    );
     
    await subjectServices.updateSubject({
      updateOptions: updateObject,
      whereOptions: whereObject,
    });
    const admin = await userServices.getAdmin();
    await mailer.sendMailToUser({
      Admin: admin,
      body: user,
      stat: req.body.approved_stat,
    });
    res.status(200).json({
      message: data.message,
      details: data.data,
    });
  }
}

module.exports = {
  signUp,
  signIn,
  updateUser,
  approveStatus,
};
