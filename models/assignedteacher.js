"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AssignedTeacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users, Subjects }) {
      // define association here
      AssignedTeacher.belongsTo(Users, {
        foreignKey: "teacher_id",
        as: "Grade",
      });
      AssignedTeacher.belongsTo(Subjects, {
        foreignKey: "subject_id",
      });
    }
  }
  AssignedTeacher.init(
    {
      subject_id: DataTypes.INTEGER,
      teacher_id: DataTypes.INTEGER,
      grade: {
        type: DataTypes.INTEGER,
      },
      // teacher_approval: {
      //   type: DataTypes.BOOLEAN,
      // },
      // admin_approval: {
      //   type: DataTypes.BOOLEAN,
      // },
    },
    {
      sequelize,
      modelName: "AssignedTeacher",
    }
  );
  return AssignedTeacher;
};
