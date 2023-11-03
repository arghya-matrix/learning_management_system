const db = require("../models/index");

async function createClass({ createObject }) {
  const classes = await db.Class.create(createObject);
  return classes;
}

async function getClass({ whereOptions, index, size, orderOptions, whereObject, whereObjectClassTable }) {
  const classes = await db.Class.findAndCountAll({
    attributes :["total_students","grade","time","date"] ,
    include: [
      {
        model: db.Subjects,
        as: "Classes",
        where: whereOptions,
        required: false
      },
      {
        model: db.Users,
        attributes: ["Name", "email_address"],
        as: "Teachers",
        where: whereObject,
        required: false
      },
    ],
    where: whereObjectClassTable,
    order: orderOptions,
    limit: size,
    offset: index,
  });
  return classes;
}

async function updateClass({ updateOptions, whereOptions }) {
  const [numUpdatedRows] = await db.Class.update(updateOptions, {
    where: whereOptions,
  });
  const classes = await db.Class.findOne({
    include: [
      {
        attributes: ["Name", "email_address"],
        as: "Students",
      },
      {
        attributes: ["Name", "email_address"],
        as: "Teachers",
      },
    ],
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

async function deleteClass({ whereOptions }) {
  try {
    await db.Class.destroy({
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

module.exports = {
  createClass,
  getClass,
  updateClass,
  deleteClass,
};