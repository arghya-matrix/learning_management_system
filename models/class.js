"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users, Subjects }) {
      // define association here
      Class.belongsTo(Users, {
        foreignKey: "teacher_id",
        as: "Teachers",
      });
      Class.belongsTo(Subjects, {
        foreignKey: "subject_id",
        as: "Classes",
      });
    }
  }
  Class.init(
    {
      subject_id: DataTypes.INTEGER,
      teacher_id: DataTypes.INTEGER,
      total_students: DataTypes.INTEGER,
      grade: {
        type: DataTypes.INTEGER,
      },
      time: DataTypes.TIME,
      date: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "Class",
    }
  );
  return Class;
};
