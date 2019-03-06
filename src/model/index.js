const Sequelize = require('sequelize');

const db = {};

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
  }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
