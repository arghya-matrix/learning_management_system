const db = require("../models");

async function subcribeToTeacher({ createObject }) {
  const subcribe = await db.SubscribedStudents.create(createObject);
  return subcribe;
}

async function updateSubcription({ updateOptions, whereOptions }) {
  const [numUpdatedRows] = await db.SubscribedStudents.update(updateOptions, {
    where: whereOptions,
  });
  if (numUpdatedRows > 0) {
    return {
      error: false,
      statuscode: 200,
      message: "Class updated",
      data: classes,
    };
  } else {
    return {
      error: true,
      statuscode: 404,
      message: "subject cannot be updated",
      data: classes,
    };
  }
}

async function deleteSubcription({ whereOptions }) {
  try {
    await db.SubscribedStudents.destroy({
      where: whereOptions,
    });
    return {
      error: false,
      statusCode: 200,
    };
  } catch (error) {
    console.log(error, "internal error");
    return {
      error: true,
      statusCode: 500,
    };
  }
}

async function getSubsription({ whereOptions, index, size, orderOptions }) {
  const subsriptions = await db.SubscribedStudents.findAndCountAll({
    include: [
      {
        attributes : ["Name", "email_address"],
        as: "subcribed_by",
      },
      {
        attributes : ["Name", "email_address"],
        as: "subcribed_to",
      },
    ],
  });
}

module.exports = {
  subcribeToTeacher,
  updateSubcription,
  deleteSubcription,
  getSubsription
};
