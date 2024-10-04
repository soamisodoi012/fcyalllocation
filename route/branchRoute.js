
const express = require('express');
const createcompany= require('../controller/createBranch.js');
const router = express.Router();
const { verifyToken, } = require('../middleware/security');
router.post('/createBranch', createcompany);
module.exports=router;