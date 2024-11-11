const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize, Op } = require('sequelize');
const User = require('../model/user');
const Role = require('../model/role');
const UnauthorizedFcyAllocation=require('../model/FcyInAu')
const LiveFcyAllocation= require('../model/FcyLive')
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { validationResult } = require('express-validator');
const req = require('express/lib/request');
const res = require('express/lib/response');
const { where } = require('sequelize');
const createUser = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extract necessary fields from the request body
    const { username, role,fullname } = req.body;

    // Check for required fields
    if (!username || !role) {
      return res.status(400).json({
        message: 'Username and roleId are required',
      });
    }

    // Create the user
    const user = await User.create({ username, role,fullname });

    // Return the created user (excluding sensitive data)
    res.status(201).json({
      user: {
        username: user.username,
        fullname:user.fullname,
        roleId: user.roleId
        // Exclude sensitive data like passwords
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      message: 'An error occurred while creating the user',
      error: error.message,  // Include error details for debugging
    });
  }
};
  const changeProfile=async (req,res)=>
    {
      data = req.body
    const changeP= await User.findOne({
      where: { username: req.params.pk,
      }});
      if(changeP){
        await changeP.update(data);
        res.status(200).json({
          message: 'profile  updated successfully',
          data: data,
        }); 

      }
  }


  
  const nodemailer = require('nodemailer');

  // Create a transporter object using Gmail
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'soamisodoi012@gmail.com', // Your Gmail account
          pass: 'xraeszboomvrehvf' // Your email password or app password
      },
      socketTimeout: 60000
  });
  
  // Controller method to send email
  const sendEmailNotification = async (userEmail) => {
      try {
          // Define mail options
          const mailOptions = {
              from: 'soamisodoi012@gmail.com',
              to: 'getaadmas6052gmail.com', // Dynamically replace with the recipient's email
              subject: 'notif',
              text: 'The ceo.' // Simple text message
          };
  
          // Send the email
          await transporter.sendMail(mailOptions);
          console.log('Email sent successfully.');
      } catch (error) {
          console.error('Error sending email:', error);
      }
  };
  const profile = async (req, res) => {
    try {
      

//           // Get the token from the Authorization header
          const authHeader = req.headers.authorization;
         const token = authHeader && authHeader.split(' ')[1]; // Assumes "Bearer <token>"
  
//           // Verify and decode the token to get the user ID
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Use your actual secret key
          const immputer = decoded.id; // Adjust according to your token structure
      // Query for new and pending records in UnauthorizedFcyAllocation
      const unauthorizedData = await UnauthorizedFcyAllocation.findAll({
        where: { immputer: req.params.immputer },
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('status')), 'activity'] // Count occurrences of each status
        ],
        group: ['status'],
        having: {
          status: {
            [Sequelize.Op.in]: ['pending', 'authorized','waitingAuthorization'] // Filter for new and pending statuses
          }
        }
      });
  
      // Query for authorized records in LiveFcyAllocation
      const liveData = await LiveFcyAllocation.findAll({
        where: { immputer: req.params.immputer },
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('status')), 'activity'] // Count occurrences of authorized status
        ],
        
        group: ['status'],
        having: {
          status: {
            [Sequelize.Op.in]: ['approved'] // Filter for new and pending statuses
          }
        }
      });
  
      // Combine the unauthorized and authorized data into a single statusCounts object
      const activity = {
        pending: 0,
        authorized: 0,
        approved: 0,
        waitingAuthorization: 0
      };
  
      // Process UnauthorizedFcyAllocation results
      unauthorizedData.forEach(record => {
        activity[record.status] = parseInt(record.dataValues.activity, 10);
      });
  
      // Process LiveFcyAllocation results
      if (liveData.length) {
        activity.authorized = parseInt(liveData[0].dataValues.statusCount, 10);
      }
      // Return the combined status counts
      return res.status(200).json({
        activity});
  
    } catch (error) {
      console.error('Error retrieving records:', error);
      return res.status(500).json({
        message: 'Error retrieving records',
        error: error.message
      });
    }
  };
  const resetUser=async (req,res)=>
    {
      //data = req.body
    const reset= await User.findOne({
      where: { username: req.params.pk,
      }});
      if(reset){
        reset.islocked='true' 
        await reset.save();
        res.status(200).json({
          message: 'user  reset successfully',
        }); 

      }
  }
  
  const getAllUser=async (req,res)=>{
    
    try {
      const user = await User.findAll();
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const getAllRole=async (req,res)=>{
    
    try {
      const role = await Role.findAll();
      res.status(200).json(role);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const resetPasswordRequest=async (req,res)=>
    {
      username= req.body
    const reset= await User.findOne({
      where: { username: username,
      }});
      if(reset){
        reset.isreseted='true'
        await reset.save();
        res.status(200).json({
          message: 'success',
        }); 

      }
  };
  const resetPassword=async (req,res)=>
    {
      username= req.body
    const reset= await User.findOne({
      where: { username: username,
      }});
      if(reset){
        reset.isreseted='false'
        reset.isPasswordChanged='false'
        reset.password='Password@123'
        const salt = await bcrypt.genSalt(10);
        reset.password = await bcrypt.hash(reset.password, salt);
        await reset.save();
        res.status(200).json({
          message: 'user  reset successfully',
        }); 

      }
  };
module.exports = {
  createUser,
  resetPassword,
  resetPasswordRequest,
  resetUser,
  profile,
  changeProfile,
  sendEmailNotification,
  getAllUser,
  getAllRole,
};

