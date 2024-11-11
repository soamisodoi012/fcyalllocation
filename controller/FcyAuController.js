const FcyLiveAllocation = require('../model/FcyLive');
const FcyInAu = require('../model/FcyInAu');
const res = require('express/lib/response');
//const UnauthorizedFcyAllocation=

const approveFcy = async (req, res) => {
  try {
      // Fetch the record from FcyInAu using the primary key from the request
      const fcyAuthorize = await FcyInAu.findByPk(req.params.pk);
      if (!fcyAuthorize) {
          return res.status(404).json({ message: 'Record not found' });
      }
      // Check if queueNumber already exists in FcyLiveAllocation
      const existingAllocation = await FcyLiveAllocation.findOne({
          where: { queueNumber: fcyAuthorize.queueNumber }
      });

      if (existingAllocation) {
          return res.status(400).json({ message: 'Queue number already exists in FcyLiveAllocation' });
      }
      // Create a new record in FcyLiveAllocation based on the fetched data
      const fcyAuthorized = await FcyLiveAllocation.create({
        queueNumber: fcyAuthorize.queueNumber,
        queueDate:fcyAuthorize.queueDate,
        importerName: fcyAuthorize.importerName,
        importerNBEAccNumber:fcyAuthorize.importerNBEAccNumber,
        importerTIN:fcyAuthorize.importerTIN,
        importerPhone:fcyAuthorize.importerPhone,
        item:fcyAuthorize.item,
        category:fcyAuthorize.category,
        hsCode:fcyAuthorize.hsCode,
        applicationDate:fcyAuthorize.applicationDate,
        proformaDate:fcyAuthorize.proformaDate,
        proformaNumber:fcyAuthorize.proformaNumber,
        proformaCurrency:fcyAuthorize.proformaCurrency,
        proformaAmount:fcyAuthorize.proformaAmount,
        equivalentUsd:fcyAuthorize.equivalentUsd,
        branch:fcyAuthorize.branch,
        modeOfPayment:fcyAuthorize.modeOfPayment,
        approvedDate:fcyAuthorize.queueDate,
        approvedBy:fcyAuthorize.immputer,//req.user.username
        immputer:fcyAuthorize.immputer// ,
      });
      // Remove from the unauthorized table
      await FcyInAu.destroy({ where: { queueNumber: req.params.pk } }); // Uncomment if needed

      return res.status(200).json({
          message: 'Record approved successfully',
          fcyAuthorized,
      });
  } catch (error) {
      console.error('Error approving Fcy:', error);

      return res.status(500).json({
          message: 'An error occurred while approving Fcy',
          error: error.message,
      });
  }
};

const viewById=async(req,res)=> {
    try {
    const viewDataById = await FcyLiveAllocation.findOne({where: { queueNumber: req.params.pk }});
    if (viewDataById){
        return res.status(200).json({ viewDataById,});
        }
        else{
            return res.status(404).json({ message: 'not found'}); 
        }
    }
    catch (error) {
        return res.status(500).json({
        message: 'An error occurred while fetching  data ',
        error: error.message,
    });
    }
};
const viewAllocation = async (req, res) => {
    try {
        const viewAllocationData = await FcyLiveAllocation.findAll();
        return res.status(200).json({ data: viewAllocationData });
    } catch (error) {
        return res.status(500).json({
            message: 'Error while retrieving allocation data',
            error: error.message,
        });
    }
};
  const getLiveByPhone=async (req, res) => {
   try
   { const {importerPhone}=req.body;
    const allocationData = await FcyLiveAllocation.findAll({where: {importerPhone:importerPhone},});
    if(!allocationData){
      return res.status(404).json({ message: 'Allocation not found' });
    }
    return res.status(200).json({ allocationData });
  }
  catch (error) {
    return res.status(500).json({
      message: 'Error while retrieving allocation data',
      error: error.message,
    });
  }}
  const getByApprovedDate=async (req, res) => {
    try
    { const {approvedDate}=req.body;
     const allocationData = await FcyLiveAllocation.findAll({where: {approvedDate:approvedDate},});
     if(!allocationData){
       return res.status(404).json({ message: 'Allocation not found' });
     }
     return res.status(200).json({ allocationData });
   }
   catch (error) {
     return res.status(500).json({
       message: 'Error while retrieving allocation data',
       error: error.message,
     });
   }}
module.exports = {
    approveFcy,
    getLiveByPhone,
    viewById,
    viewAllocation,
    getByApprovedDate,
}
