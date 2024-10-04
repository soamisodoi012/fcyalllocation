// const User = require('../model/user');

// const createUser = async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     res.status(201).json({
//       user
//     });
//   } catch (error) {  // Pass the error object here
//     console.error('Error creating user:', error);

//     return res.status(500).json({
//       message: 'An error occurred while creating user',
//       error: error.message,
//     });
//   }
// };//BNK/T24.UPGRADE  tail -999f tSA_1_20240910_08-17-04


// module.exports = {
//   createUser,
//     // Export as an object property
// };
const { validationResult } = require('express-validator');  // Import validationResult
const User = require('../model/user');

// Create User Function
const createUser = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.create(req.body);
    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        // Do not return sensitive data like passwords
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

module.exports = {
  createUser,
};
