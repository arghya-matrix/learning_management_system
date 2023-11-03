"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("AssignedTeachers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      subject_id: {
        type: DataTypes.INTEGER,
      },
      teacher_id: {
        type: DataTypes.INTEGER,
      },
      grade: {
        type: DataTypes.INTEGER,
      },
      // teacher_approval: {
      //   type: DataTypes.BOOLEAN,
      // },
      // admin_approval: {
      //   type: DataTypes.BOOLEAN,
      // },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("AssignedTeachers");
  },
};
