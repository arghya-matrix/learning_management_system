const { Op } = require("sequelize");
const db = require("../models/index");


async function findUser({ whereOptions, index, size, attributes }) {
  const user = await db.Users.findAndCountAll({
    attributes: attributes,
    where: whereOptions,
    limit: size,
    offset: index,
    raw: true,
  });
  return user;
}

async function createUser({ createObject }) {
  const user = await db.Users.create(createObject, {
    raw: true,
  });
  return user;
}

async function deleteUser({ whereOptions }) {
  try {
    await db.Users.destroy({
      where: whereOptions,
    });
    return {
      error: false,
      statuscode: 200,
    };
  } catch (error) {
    console.log(error, "Error deleting user... in services", error);
    return {
      error: true,
      statuscode: 403,
      message: "",
    };
  }
}

async function updateUser({ whereOptions, updateOptions }) {
  try {
    const [numUpdatedRows] = await db.Users.update(updateOptions, {
      where: whereOptions,
    });
    if (numUpdatedRows >= 0) {
      const user = await db.Users.findOne({
        where: whereOptions,
      });
      return {
        error: false,
        statuscode: 200,
        message: "User updated",
        data: user,
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

async function findOneUser({ whereOptions, attributes }) {
  const user = await db.Users.findAndCountAll({
    attributes: attributes,
    where: whereOptions,
    raw: true,
  });
  // const idArray = user.map((user) => parseInt(user.id));
  return user;
}

async function getAdmin() {
  const users = await db.Users.findOne({
    where: {
      user_type: "Admin"
    },
    raw: true,
  });
  
  return users;
}

module.exports = {
  findUser,
  createUser,
  deleteUser,
  updateUser,
  findOneUser,
  getAdmin
};
