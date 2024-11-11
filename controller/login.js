
// const User = require('../model/user');
// const Session = require('../model/session');
// const Role = require('../model/role');
// const { Sequelize } = require('sequelize');
// const Permission = require('../model/permission');
// const { generateAccessToken } = require('../middleware/security');
// const pool = require('../config/database');
// const bcrypt = require('bcrypt'); 
// inlined function
// const login = async (req, res, next) => {
//   try {
//     const { username, password } = req.body;
//     // Find the user by username
//     const user = await User.findOne({ where: { username } });

//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }

//     // Validate the password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }

//     // Check if the user needs to change their password
//     if (!user.isPasswordChanged) {
//       const { username, password } = req.body;
//       await changePassword(username, password); // Call changePassword as an inline function
//       return res.status(403).json({
//         message: 'Please change your credential first (Password change required)',
//         username: user.username
//       });
//     }

//     if (user.reseted === true) {
//       return res.status(403).json({ message: 'Cannot login' });
//     }

//     // Check if the user is locked
//     if (user.islocked === true) {
//       return res.status(403).json({ message: 'User already deactivated' });
//     }

//     // Check if the user is already logged in
//     if (user.islogin == true) {
//       return res.status(403).json({ message: 'User already logged in' });
//     }

//     // Generate the access token
//     const token = generateAccessToken(user);

//     // Get the user's role and its permissions
//     const role = await Role.findOne({
//       where: { roleName: user.roleId },
//       include: {
//         model: Permission,
//         through: { attributes: [] }
//       }
//     });

//     const permissions = role.Permissions.map(permission => permission.permissionName);

//     // Insert a new session
//     await Session.create({
//       user: user.username,
//       token
//     });

//     // Set islogin to true
//     user.islogin = true;
//     await user.save();

//     // Respond with the token, user role, and permissions
//     return res.status(200).json({
//       username: user.username,
//       fullname: user.fullname,
//       isPasswordChanged: user.isPasswordChanged,
//       isreseted: user.isreseted,
//       islogin: user.islogin,
//       islocked: user.islocked,
//       token,
//       userRole: role ? role.roleName : 'Role not found',
//       permissions
//     });
//   } catch (error) {
//     next(error);
//   }

//   async function changePassword(username, newPassword) {
//     try {
//       const user = await User.findOne({ where: { username } });
//       if (!user) throw new Error('User not found');

//       // Hash the new password
//       const hashedPassword = await bcrypt.hash(newPassword, 10);
//       user.password = hashedPassword;
//       user.isPasswordChanged = true;

//       await user.save();
//     } catch (error) {
//       console.error('Error changing password:', error);
//       throw error; // Throw error to be handled by the outer try-catch
//     }
//   }
// };
const User = require('../model/user');
const Session = require('../model/session');
const Role = require('../model/role');
const { Sequelize } = require('sequelize');
const Permission = require('../model/permission');
const { generateAccessToken } = require('../middleware/security');
const pool = require('../config/database');
const bcrypt = require('bcrypt'); 

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (!user.isPasswordChanged) {
      return res.status(403).json({
        message: 'Please change Password change required)',
        username: user.username
      });
    }

    if (user.reseted === true) {
      return res.status(403).json({ message: 'Cannot login' });
    }

    if (user.islocked === true) {
      return res.status(403).json({ message: 'User already deactivated' });
    }

    if (user.islogin == true) {
      return res.status(403).json({ message: 'User already logged in' });
    }

    const token = generateAccessToken(user);

    const role = await Role.findOne({
      where: { roleName: user.roleId },
      include: {
        model: Permission,
        through: { attributes: [] }
      }
    });

    const permissions = role.Permissions.map(permission => permission.permissionName);

    await Session.create({
      user: user.username,
      token
    });

    user.islogin = true;
    await user.save();

    return res.status(200).json({
      username: user.username,
      fullname: user.fullname,
      isPasswordChanged: user.isPasswordChanged,
      isreseted: user.isreseted,
      islogin: user.islogin,
      islocked: user.islocked,
      token,
      userRole: role ? role.roleName : 'Role not found',
      permissions
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isPasswordChanged = true;

    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'An error occurred while changing the password' });
  }
};

module.exports = {
  login,
  changePassword
};

