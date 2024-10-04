// FcyInAuRoute.js

const express = require('express');
const {createFcyInAu,updateUnauthorizedFcyAllocation,deleteFcyInAu} = require('../controller/FcyInAuController.js');
const {approveFcy,viewById, rejectById,viewAllocation,auById} = require('../controller/FcyAuController.js'); // Import the controller object
const {getUnauthorizedFcyCount,getAuthorizedFcyCount,getApprovedInMonth}= require('../controller/dashboard.js');
const router = express.Router();
const { verifyToken, refreshToken, generateAccessToken, generateRefreshToken } = require('../middleware/security');
const requiredPermissions = ['create'];
router.post('/FcyInAu', createFcyInAu);// Use the function from the controller object, verifyToken(['read']),
router.post('/authorrizeFcy/:pk',approveFcy);//verifyToken(['read'])
router.post('/updateUnauthorizedFcyAllocation/:pk',updateUnauthorizedFcyAllocation);
router.get('/getAuthorizedFcyCount',getAuthorizedFcyCount);
router.get('/getUnauthorizedFcyCount',getUnauthorizedFcyCount);
router.delete('/deleteFcyInAu/:pk',deleteFcyInAu);
router.get('/viewById/:pk',viewById);
router.post('/rejectById/:pk',rejectById);
router.get('/viewAllocation/',viewAllocation);
router.get('/auById/:pk',auById);
router.get('/getlastmonthData',getApprovedInMonth);
module.exports = router;
