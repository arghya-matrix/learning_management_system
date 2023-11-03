const db = require("../models/index");

async function assignTeacher({ createTable }) {
  await db.AssignedTeacher.bulkCreate(createTable);
  return;
}

async function deleteTeacher({ whereOptions }) {
  await db.AssignedTeacher.destroy({
    where: whereOptions,
  });
}

async function getAssignedTeacher({
  whereOptions,
  index,
  size,
  orderOptions,
  searchByTeacher,
  searchBySubject,
}) {
  const assignedTeacher = await db.Users.findAndCountAll({
    attributes: ["Name", "email_address"],
    include: [
      {
        model: db.AssignedTeacher,
        attributes : ["grade","subject_id"],
        as: "Grade",
        where: whereOptions,
        limit: size,
        offset: index,
        order: orderOptions,
        include: {
          model: db.Subjects,
          attributes: ["Name", "No_of_Teachers_now"],
          where: searchBySubject,
        },
      },
    ],
    where: searchByTeacher,
    distinct: true,
  });
  return assignedTeacher;
}

async function updateAssignTeacher({ updateOptions, whereOptions }) {
  const [numUpdatedRows] = await db.AssignedTeacher.update(updateOptions, {
    where: whereOptions,
  });
  const teachers = await db.AssignedTeacher.findAndCountAll({
    include: [
      {
        attributes: ["Name", "email_address"],
        model: db.Users,
        as: "Grade",
      },
      {
        model: db.Subjects,
      },
    ],
  });
  if (numUpdatedRows > 0) {
    return {
      error: false,
      statuscode: 200,
      message: "Subject updated",
      data: teachers.rows,
    };
  } else {
    return {
      error: true,
      statuscode: 404,
      message: "subject cannot be updated",
      data: teachers.rows,
    };
  }
}

module.exports = {
  assignTeacher,
  deleteTeacher,
  updateAssignTeacher,
  getAssignedTeacher,
};
