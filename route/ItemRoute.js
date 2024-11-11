const express = require('express');
const router = express.Router();
const {createItemDetail, createItemCategory,getItemsByCategory}=require('../controller/itemMgnt.js');
router.post('/createItem', createItemDetail)
router.post('/createItemCategory', createItemCategory);
router.get('/getItemsByCategory', getItemsByCategory)
module.exports = router;