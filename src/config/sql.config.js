const { Sequelize } = require('sequelize');
const { sqlConfig } = require('./config.js');
const { logger } = require('sequelize/lib/utils/logger');

const sequelize = new Sequelize(sqlConfig.db, sqlConfig.user, sqlConfig.pwd, {
  host: sqlConfig.host,
  dialect: sqlConfig.dialect,
  port: sqlConfig.port,
  logging: false, // Disable logging
});

const authenticateSql = async () => {
  try {
    await sequelize.authenticate();
  } catch (exception) {
    throw exception;
  }
};

module.exports = {
  sequelize,
  authenticateSql
};
