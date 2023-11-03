const { Op } = require("sequelize");
const subjectServices = require("../services/subject.services");
const userServices = require("../services/user.services");

async function createSubject(req, res) {
  try {
    const createObject = {};
    createObject.Name = req.body.Name;
    const subject = await subjectServices.addSubject({
      createObject: createObject,
    });
    
    res.status(200).json({
      message: `Subject Created`,
      subject: subject,
    });
  } catch (error) {
    console.log(error, "internal error");
    res.status(500).json({
      message: `Internal Error`,
    });
  }
}

async function updateSubject(req, res) {
  try {
    if (req.userdata.type == "Admin") {
      const updateOptions = {};
      const whereOptions = {};
  
      if (req.query.Name) {
        if (
          req.query.Name == "" ||
          req.query.Name == undefined ||
          req.query.Name == null
        ) {
          res.status(403).json({
            message: `Subject Cannot be null or undefined or blank`,
          });
        } else {
          updateOptions.Name = req.query.Name;
        }
      }
      if (req.query.teachers_count) {
        if (
          req.query.teachers_count == 0 ||
          req.query.teachers_count == undefined ||
          req.query.teachers_count == null
        ) {
          res.status(403).json({
            message: `Teachers count cannot be null or undefined or blank`,
          });
        }
      }
      if (!req.query.subject_id) {
        res.status(403).json({
          message: `Subject id required to update`,
        });
      } else {
        whereOptions.id = req.query.subject_id;
      }
      const data = await subjectServices.updateSubject({
        updateOptions: updateOptions,
        whereOptions: whereOptions,
      });
      if (data.error == false) {
        res.json(data);
      } else {
        res.json(data);
      }
    } else {
      req.staatus(401).json({
        message:`Only admin can access this`
      })
    }
  } catch (error) {
    console.log(error, "internal error");
    res.status(500).json({
      message: `Internal Error`,
    });
  }
}

async function deleteSubject(req, res) {
  try {
    if (!req.query.subject_id) {
      res.status(403).json({
        message: `User id required to delete the subject`,
      });
    }
    const whereOptions = {};
    whereOptions.id = req.query.subject_id;
    const data = await subjectServices.deleteSubject({
      whereOptions: whereOptions,
    });
    if (data.error == false) {
      const updateObject = {};
      updateObject.preferred_sub = null;
      const whereObject = {};
      whereObject.preferred_sub = req.query.subject_id;
      await userServices.updateUser({
        updateOptions: updateObject,
        whereOptions: whereObject,
      });
      res.json(data);
    } else {
      res.json(data);
    }
  } catch (error) {
    console.log(error, "internal error");
    res.status(500).json({
      message: `Internal Error`,
    });
  }
}

async function getSubject(req, res) {
  try {
    const page = req.query.page ? req.query.page : 1;
    const itemsInPage = req.query.size;
    const size = itemsInPage ? +itemsInPage : 3;
    const index = page ? (page - 1) * size : 0;
    const whereOptions = {};
    const orderOptions = [];
    if (req.query.Name) {
      whereOptions.Name = { [Op.substring]: req.query.subject_name };
    }
    if (req.query.colName && req.query.orderName) {
      orderOptions.push([req.query.colName, req.query.orderName]);
    } else {
      orderOptions.push(["createdAt", "DESC"]);
    }
    const subject = await subjectServices.getSubject({
      index: index,
      orderOptions: orderOptions,
      size: size,
      whereOptions: whereOptions,
    });
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(subject.count / size);
    res.json({
      message: `${subject.count} Subjects found`,
      currentPage: currentPage,
      totalPages: totalPages,
      subject: subject.rows,
    });
  } catch (error) {
    console.log(error, "internal error");
    res.status(500).json({
      message: `Internal Error`,
    });
  }
}

module.exports = {
  createSubject,
  updateSubject,
  deleteSubject,
  getSubject,
};
