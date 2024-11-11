const sequelize = require('../config/database');
 const UnauthorizedFcyAllocation = require('../model/FcyInAu')
 const authorizedFcyAllocation = require('../model/FcyLive')
 const permission = require('../model/permission')
 const role = require('../model/role')
 const user = require('../model/user')
 const session = require('../model/session');
 //const currency = require('../model/currency');
 const branch =require('../model/branch')
 const item = require('../model/ItemDetail')
 const category = require('../model/Category')
 const notification =require('../model/Notification')
 const rolePermission = require('../model/rolePermission')
 require('../model/associations');
sequelize.sync({ force: true }).then(() => {
    console.log("Database refreshed successfully!");
}).catch(err => {
    console.error("Error synchronizing the database:", err);
});
