"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subjects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users, Class, AssignedTeacher }) {
      // define association here
      Subjects.hasMany(Users, {
        foreignKey: "preferred_sub",
        onUpdate: "CASCADE",
        as: "Subject",
      });
      Subjects.hasMany(Class, {
        foreignKey: "subject_id",
        as: "Classes",
        onUpdate: "CASCADE",
      });
      Subjects.hasMany(AssignedTeacher, {
        foreignKey: "subject_id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }
  Subjects.init(
    {
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      No_of_Teachers_now: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Subjects",
    }
  );
  return Subjects;
};
