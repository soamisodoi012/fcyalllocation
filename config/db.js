// Load environment variables from the .env file
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

module.exports = {
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',  // Explicitly specify the dialect for production
    migrationStorage: 'json',
    migrationStoragePath: 'C:/Users/hp/Desktop/FcyRegistration/migrations/sequelizeMeta.json',  // Specify the path for the JSON file
  },
  fcytest: {
    username: "postgres",
    password: "rootpass",
    database: "FcyTest",
    host: "localhost",
    dialect: 'postgres',  // Explicitly specify the dialect for testing
    migrationStorage: 'json',
    migrationStoragePath: 'C:/Users/hp/Desktop/FcyRegistration/migrations/sequelizeMeta.json',  // Specify the path for the JSON file
  }
  // other environments...
};
