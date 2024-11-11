// // FcyInAuRoute.js

const express = require('express');
const {createFcyInAu,fetchCurrencyData,auById,rejectById,waitingForAuthorization,updateUnauthorizedFcyAllocation,deleteFcyInAu} = require('../controller/FcyInAuController.js');
const {approveFcy,viewById,viewAllocation} = require('../controller/FcyAuController.js'); // Import the controller object
const {waitingForAuthorizationCount,getNumberOfPendingFcy,getFcyAllocationCounts,consolidated,countAllApproved,getNumberOfRejectedFcy,getNumberOfAuthorizedFcy}= require('../controller/dashboard.js');
const {getAllFcyInAu,getFcyInAuByIdWithRejectionHistory}=require('../controller/viewInAuFcy.js')
const router = express.Router();
const { verifyToken, refreshToken, generateAccessToken, generateRefreshToken } = require('../middleware/security');
const requiredPermissions = ['create'];

router.get('/fetchCurrencyData', fetchCurrencyData); // Fetching Currency Data for FcyInAu
router.get('/getFcyAllocationCounts',getFcyAllocationCounts);
router.post('/createINUFcy',createFcyInAu);//, verifyToken(['createINUFcy']) Use the function from the controller object, verifyToken(['read']),
router.post('/approve/:pk',approveFcy);//verifyToken(['read'])verifyToken(['approveFcyById'])
router.post('/editINUFcy/:pk',verifyToken(['editINUFcy']),updateUnauthorizedFcyAllocation);
router.get('/countAllRejected',verifyToken(['countAllRejected']),getNumberOfRejectedFcy);
router.get('/countAllApproved',verifyToken(['countAllApproved']),countAllApproved);
router.get('/countAuthorizedFcy',verifyToken(['countAuthorizedFcy']),getNumberOfAuthorizedFcy);
router.get('/countWaitingForAuthorized',waitingForAuthorizationCount);//verifyToken(['countWaitingForAuthorization'])
router.delete('/deleteINUFcy/:pk',verifyToken(['deleteINUFcy']),deleteFcyInAu);
router.get('/readLiveFcyById/:pk',verifyToken(['readLiveFcyById']),viewById);
router.post('/rejectINUById/:pk',rejectById);//verifyToken(['rejectINUById'])
router.get('/readAllLiveFcy/',verifyToken(['readAllLiveFcy']),viewAllocation);
router.get('/readAllINUFcy',verifyToken(['readAllINUFcy']),getAllFcyInAu)
router.post('/authorizeINUById/:pk',auById);//,verifyToken(['authorizeINUById'])
router.get('/readINUFcyById/:pk',getFcyInAuByIdWithRejectionHistory);//,verifyToken(['readINUFcyById'])
router.post('/makeWaitingForAuthorization/:pk',waitingForAuthorization);///verifyToken(['makeWaitingForAuthorization']),
router.get('/consolidated/',consolidated);

module.exports = router;