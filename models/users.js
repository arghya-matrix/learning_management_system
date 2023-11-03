"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Subjects, Class, AssignedTeacher, SubscribedStudents }) {
      // define association here
      Users.belongsTo(Subjects, {
        foreignKey: "preferred_sub",
        as: "Subject",
      });
      Users.hasMany(Class, {
        foreignKey: "teacher_id",
        as: "Teachers",
        onUpdate: "CASCADE",
      });
      Users.hasMany(AssignedTeacher, {
        foreignKey: "teacher_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        as: "Grade",
      });
      Users.hasMany(SubscribedStudents, {
        foreignKey: "student_id",
        as: "subcribed_by",
      });
      Users.hasMany(SubscribedStudents, {
        foreignKey: "teacher_id",
        as: "subcribed_to",
      });
    }
    toJSON() {
      return { ...this.get(), password: undefined };
    }
  }
  Users.init(
    {
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
      },
      user_type: {
        type: DataTypes.STRING,
        defaultValue: "End-User",
      },
      approved_stat: {
        type: DataTypes.BOOLEAN,
      },
      preferred_sub: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
