const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../model/user'); // Import the User model
const Role = require('../model/role'); // Import the Role model
const Permission = require('../model/permission'); // Import the Permission model
const RolePermission = require('../model/rolePermission');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

// Token expiration times
const ACCESS_TOKEN_EXPIRATION = '35s';
const generateAccessToken = (user) => {
    return jwt.sign({ roleId: user.roleId, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRATION });
};
const token = async (req, res) => {
    const { roleId, username } = req.body;

    // Validate that roleId and username are provided
    if (!roleId || !username) {
        return res.status(400).send('roleId and username are required');
    }

    try {
        // Generate token and send it back as response
        const accessToken = generateAccessToken({ roleId, username });
        return res.json({ accessToken });
    } catch (error) {
        // Handle any potential errors
        return res.status(500).send('Error generating token');
    }
};

const verifyToken = (requiredPermissions = []) => {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    
                    return res.status(401).json({ message: 'Token expired, please log in again' });
                }
                return res.status(401).json({ message: 'Failed to authenticate token' });
            }

            try {
                // Find all permissions associated with the roleId
                const rolePermissions = await RolePermission.findAll({
                    where: { roleId: decoded.roleId },
                    attributes: ['permissionId'], // Fetch only `permissionId`
                });

                if (!rolePermissions || rolePermissions.length === 0) {
                    return res.status(403).json({ message: 'No permissions assigned to this role' });
                }

                // Extract permissions into an array
                const userPermissions = rolePermissions.map(rp => rp.permissionId);
                console.log(userPermissions);
                console.log(requiredPermissions);

                // Check if all required permissions are included in the user's permissions
                const hasAllRequiredPermissions = requiredPermissions.every(permission => userPermissions.includes(permission));

                if (!hasAllRequiredPermissions) {
                    return res.status(403).json({ message: 'Access denied: insufficient permissions' });
                }

                // Attach the user and their permissions to the request object
                req.user = {
                    username: decoded.username,
                    roleId: decoded.roleId,

                  // Assuming decoded contains username
                }; 
                req.user.permissions = userPermissions;

                // Proceed to the next middleware or route handler
                next();
            } catch (error) {
                console.error('Error fetching permissions:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    };
};
const refreshAccessToken = async (req, res) => {
    // Check if the Authorization header is provided
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'No refresh token provided' });
    }

    // Extract the refresh token from the Authorization header
    const refreshToken = authHeader.split(' ')[1];

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);
        
        // Generate a new access token
        const newAccessToken = generateAccessToken({ roleId: decoded.roleId, username: decoded.username });
        
        return res.json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};


module.exports = {
    verifyToken,
    refreshAccessToken,
    generateAccessToken,
    token,
   // generateRefreshToken,
};
