 require('dotenv').config(); // Load .env file

 const { Sequelize } = require('sequelize');

 const sequelize = new Sequelize('Fcy','postgres','rootpass',
   {
     host: process.env.DB_HOST,
     dialect: 'postgres',
     port: parseInt(process.env.DB_PORT, 10), // Convert to integer
   }
 );
 module.exports = sequelize;
