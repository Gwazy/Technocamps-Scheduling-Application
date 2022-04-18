"use strict";

const { sequelize } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Entries", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      bookingDate: {
        type: Sequelize.STRING,
      },
      bookingTime: {
        type: Sequelize.STRING,
      },
      online: {
        type: Sequelize.BOOLEAN,
      },
      calendarID: {
        type: Sequelize.STRING,
      },
      confirmation: {
        type: Sequelize.BOOLEAN,
      },
      pending: {
        type: Sequelize.BOOLEAN,
      },
      userID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Entries");
  },
};
