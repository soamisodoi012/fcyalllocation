const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');
const {getNotification} = require('../controller/notification.js');
const {login,changePassword} = require('../controller/login.js');
const {logout} = require('../controller/logout.js');
const {setupRolesAndPermissions,createRole,getAllRole,getAllPermissions} = require('../controller/rolePermission.js');
const ValidationRules = require('../util/userDataValidation.js');
const { verifyToken, refreshToken, generateAccessToken, token } = require('../middleware/security');
router.post('/createUser',userController.createUser);
router.post('/sendEmailNotification',userController.sendEmailNotification)
router.get('/getNotification',getNotification)
router.post('/permission',setupRolesAndPermissions);
router.post('/getAllRole',getAllRole);
router.post('/getAllPermissions',getAllPermissions);
router.post('/createRole',createRole);
router.post('/generateAccessToken',token)
router.post('/profile/:immputer',userController.profile)
router.post('/login',login);
router.post('/logout',logout);
router.post('/changePassword',changePassword);//,generateAccessToken);
module.exports = router;