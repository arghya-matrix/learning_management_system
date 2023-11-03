"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SubscribedStudents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SubscribedStudents.init(
    {
      class_id: DataTypes.INTEGER,
      student_id: DataTypes.INTEGER,
      teacher_id: {
        type: DataTypes.INTEGER,
      },
      teacher_approval: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "SubscribedStudents",
    }
  );
  return SubscribedStudents;
};
