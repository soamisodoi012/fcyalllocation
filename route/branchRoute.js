
const express = require('express');
const inserbranch= require('../controller/createBranch.js');
const router = express.Router();
const { verifyToken, } = require('../middleware/security');
router.post('/createBranch', inserbranch.inserb);
router.get('/selectBranch/:branchCode',inserbranch.selectBranch)
router.get('/allBranch/',inserbranch.getAllBranch)
module.exports=router;