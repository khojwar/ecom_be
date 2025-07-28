const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/sql.config.js');
const { Status } = require("../../config/constant");

const BannerModel = sequelize.define(
  'banner',
  { 
      _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,   // making it compulsory
        unique: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true
      },
      image: {
        type: DataTypes.JSON,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM(Object.values(Status)),
        defaultValue: Status.INACTIVE,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }
);

module.exports = BannerModel;