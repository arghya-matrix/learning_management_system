const { Op } = require("sequelize");
const assignTeacherServices = require("../services/assignedTeacher.services");

async function getAssignedTeacher(req, res) {
  try {
    const whereOptions = {};
    const searchBySubject = {};
    const searchByTeacher = {};
    const page = req.query.page ? req.query.page : 1;
    const itemsInPage = req.query.size;
    const size = itemsInPage ? +itemsInPage : 3;
    const index = page ? (page - 1) * size : 0;
    const orderOptions = [];
    if (req.query.colName && req.query.orderName) {
      orderOptions.push([req.query.colName, req.query.orderName]);
    } else {
      orderOptions.push(["createdAt", "DESC"]);
    }
    if (req.query.teacher_name) {
      searchByTeacher.Name = { [Op.substring]: req.query.teacher_name };
    }
    if (req.query.subject_name) {
      searchBySubject.Name = { [Op.substring]: req.query.subject_name };
    }
    if (req.query.assignedToMe == "true") {
      whereOptions.teacher_id = req.userdata.user_id;
    }
    searchByTeacher.approved_stat = true
    searchByTeacher.user_type = "Teacher"
    const teachers = await assignTeacherServices.getAssignedTeacher({
      searchBySubject: searchBySubject,
      searchByTeacher: searchByTeacher,
      whereOptions: whereOptions,
      index: index,
      orderOptions: orderOptions,
      size: size
    });
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(teachers.count / size);
    res.status(200).json({
        message: `${teachers.count} Teachers found`,
      currentPage: currentPage,
      totalPages: totalPages,
      subject: teachers.rows,
    })
  } catch (error) {
    console.log(error, "internal error");
    res.status(500).json({
      message: `Internal Error`,
    });
  }
}

async function updateAssignTeacher(req, res) {
  try {
    const updateOptions = {};
    if (req.body.grade) {
      updateOptions.grade = req.body.grade;
    }
    if (req.body.subject_id) {
      updateOptions.subject_id = req.body.subject_id;
    }
    if (req.body.teacher_id) {
      updateOptions.teacher_id = req.body.teacher_id;
    }

    const data = await assignTeacherServices.updateAssignTeacher({
      updateOptions: updateOptions,
      whereOptions: whereOptions,
    });
    res.json(data);
  } catch (error) {
    console.log(error, "Internal Error");
    res.status(500).json({
      message: `Internal error`,
      error: error,
    });
  }
}

module.exports = {
  updateAssignTeacher,
  getAssignedTeacher
};
