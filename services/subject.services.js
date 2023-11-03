const db = require("../models/index");

async function addSubject({ createObject }) {
  const subject = await db.Subjects.create(createObject, {
    raw: true,
  });
  return subject;
}

async function updateSubject({ updateOptions, whereOptions }) {
  try {
    const [numUpdatedRows] = await db.Subjects.update(updateOptions, {
      where: whereOptions,
    });
    const subject = await db.Subjects.findOne({
      where: whereOptions,
    });
    if (numUpdatedRows > 0) {
      return {
        error: false,
        statuscode: 200,
        message: "Subject updated",
        data: subject,
      };
    } else {
      return {
        error: true,
        statuscode: 404,
        message: "subject cannot be updated",
        data: subject,
      };
    }
  } catch (error) {
    console.log(error, "Error updating user... in services", error);
    return {
      error: true,
      statuscode: 500,
      message: "Internal server error",
    };
  }
}

async function deleteSubject({ whereOptions }) {
  try {
    await db.Subjects.destroy({
      where: whereOptions,
    });
    return {
      error: false,
      statuscode: 200,
      message: "Subject deleted",
    };
  } catch (error) {
    return {
      error: true,
      statuscode: 500,
      message: "Subject Cannot be deleted",
    };
  }
}

async function getSubject({ whereOptions, index, size, orderOptions }) {
  const subjects = await db.Subjects.findAndCountAll({
    include: [
      {
        model: db.Users,
        attributes: ["Name", "email_address"],
        where: {
          approved_stat: true,
        },
        as:"Teacher" ,
        required: false,
        include: {
          model: db.AssignedTeacher,
          attributes: ["grade"],
          as: "Grade",
          required: false,
        },
      },
    ],
    where: whereOptions,
    limit: size,
    offset: index,
    order: orderOptions,
    distinct: true,
  });
  return subjects;
}

module.exports = {
  addSubject,
  updateSubject,
  deleteSubject,
  getSubject,
};
