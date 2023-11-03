const { Op } = require("sequelize");
const classServices = require("../services/class.services");
const formatTimeService = require("../services/formatTime");
const moment = require("moment");

async function createClass(req, res) {
  try {
    const data = req.body;
    const date = req.body.date;
    const formattedDate = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
    const time = req.body.time;
    const formattedTime = formatTimeService.convertTo24HourFormat(time);
    const createObject = {};
    let whereOptions;
    createObject.subject_id = data.subject_id;
    createObject.teacher_id =
      req.userdata.type == "Teacher" ? req.userdata.user_id : req.body.user_id;
    createObject.date = req.body.date ? req.body.date : formattedDate;
    createObject.time = formattedTime;
    createObject.total_students = req.body.total_students;
    createObject.grade = req.body.grade
    whereOptions = createObject;
    const findClass = await classServices.getClass({
      whereObjectClassTable:whereOptions
    })

    if(!findClass || findClass.count == 0){
      const classes = await classServices.createClass({
        createObject: createObject,
      });
      res.status(200).json({
        message: `class created`,
        data: classes,
      });
    } else{
      res.status(409).json({
        message: `class already existed`,
        data: findClass.rows,
      });
    }
    
  } catch (error) {
    console.log(error, "internal error");
    res.status(500).json({
      message: `Internal Error`,
      error: error,
    });
  }
}

async function getClasses(req, res) {
  try {
    const page = req.query.page ? req.query.page : 1;
    const itemsInPage = req.query.size;
    const size = itemsInPage ? +itemsInPage : 3;
    const index = page ? (page - 1) * size : 0;

    const whereOptions = {};
    const whereObject = {};
    const whereObjectClassTable = {};
    const orderOptions = [];

    if (req.query.subject_name) {
      whereOptions.Name = { [Op.substring]: req.query.subject_name };
    }
    if (req.query.grade) {
      whereOptions.grade = req.query.grade;
    }
    if (req.query.teacher_name) {
      whereObject.Name = { [Op.substring]: req.query.teacher_name };
    }
    if (req.query.email_address) {
      whereObject.email_address = { [Op.substring]: req.query.email_address };
    }
    if (req.query.start_date && req.query.end_date) {
      whereObjectClassTable.date = {
        [Op.and]: [
          { [Op.gte]: req.query.start_date },
          { [Op.lte]: req.query.end_date },
        ],
      };
    }
    if (req.query.start_date && !req.query.end_date) {
      whereObjectClassTable.date = { [Op.gte]: req.query.start_date };
    }
    if (!req.query.start_date && req.query.end_date) {
      whereObjectClassTable.date = { [Op.lte]: req.query.end_date };
    }

    if (req.query.colName && req.query.orderName) {
      orderOptions.push([req.query.colName, req.query.orderName]);
    } else {
      orderOptions.push(["createdAt", "DESC"]);
    }
    const classes = await classServices.getClass({
      index: index,
      orderOptions: orderOptions,
      size: size,
      whereObject: whereObject,
      whereObjectClassTable: whereObjectClassTable,
      whereOptions: whereOptions,
    });
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(classes.count / size);

    res.status(200).json({
      message: `${classes.count} Class found`,
      currentPage: currentPage,
      totalPages: totalPages,
      classes: classes.rows,
    });
  } catch (error) {
    console.log(error, "Internal error");
    res.status(500).json({
      message: `Internal Error`,
      error: error,
    });
  }
}



module.exports = {
  createClass,
  getClasses,
};
