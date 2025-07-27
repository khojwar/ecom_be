'use strict';

const { Status } = require('../src/config/constant');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('banners', { 
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,   // making it compulsory
        unique: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image: {
        type: Sequelize.JSON,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM(Object.values(Status)),
        defaultValue: Status.INACTIVE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });


  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('banners');
  }
};
