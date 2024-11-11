const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 

const { Sequelize } = require('sequelize');
// Create a new Sequelize instance using environment variables
const sequelize = new Sequelize('Fcy', 'postgres', 'rootpass', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432, // Convert port to integer
});
module.exports = sequelize;
