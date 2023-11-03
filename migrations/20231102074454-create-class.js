'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Classes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      subject_id: {
        type: DataTypes.INTEGER
      },
      teacher_id: {
        type: DataTypes.INTEGER
      },
      total_students: {
        type: DataTypes.INTEGER
      },
      grade:{
        type: DataTypes.INTEGER
      },
      time: {
        type: DataTypes.TIME
      },
      date: {
        type: DataTypes.DATEONLY
      },
      approval:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('Classes');
  }
};