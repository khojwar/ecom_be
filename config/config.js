const { sqlConfig } = require('../src/config/config')

module.exports = {
  development: {
    "username": sqlConfig.user,
    "password": sqlConfig.password,
    "database": sqlConfig.database,
    "host": sqlConfig.host,
    "dialect": `${sqlConfig.dialect}`
  },
  test: {
    "username": sqlConfig.user,
    "password": sqlConfig.password,
    "database": sqlConfig.database,
    "host": sqlConfig.host,
    "dialect": `${sqlConfig.dialect}`
  },
  production: {
    "username": sqlConfig.user,
    "password": sqlConfig.password,
    "database": sqlConfig.database,
    "host": sqlConfig.host,
    "dialect": `${sqlConfig.dialect}`
  }
}