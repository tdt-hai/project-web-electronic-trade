const Sequelize = require('sequelize');

connectionString = process.env.DATABASE_URL || 'postgres://postgres:ttth@localhost:5432/aemobile';

//const db = new Sequelize(connectionString, {
//    dialect: 'postgres',
//    protocol: 'postgres',
//    dialectOptions: {
//        ssl: {
//            rejectUnauthorized: false
//        }
//    }
//});

const db = new Sequelize(connectionString);

module.exports = db;