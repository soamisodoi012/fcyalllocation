const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../model/user'); // Import the User model
const Role = require('../model/role'); // Import the Role model
const Permission = require('../model/permission'); // Import the Permission model
const RolePermission = require('../model/rolePermission');
// Secret key used to sign and verify the JWT
const JWT_SECRET_KEY = 'psychology'; //process.env.JWT_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

// Token expiration times
const ACCESS_TOKEN_EXPIRATION = '1h';
const REFRESH_TOKEN_EXPIRATION = '7d';

// Generate a new access token
const generateAccessToken = (user) => {
    return jwt.sign({ roleId: user.roleId, username: user.username }, JWT_SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRATION });
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

// Middleware to refresh the token
const refreshToken = (req, res, next) => {
    // Extract Bearer token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'No refresh token provided' });
    }
    
    const refreshToken = authHeader.split(' ')[1]; // Extract the token part from Bearer scheme

    // Verify the refresh token
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate refresh token' });
        }

        // Fetch user from the database
        try {
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Generate a new access token
            const newAccessToken = generateAccessToken(user);
            res.json({ accessToken: newAccessToken, refreshToken });
        } catch (err) {
            return res.status(500).json({ message: 'Server error' });
        }
    });
};


module.exports = {
    verifyToken,
    refreshToken,
    generateAccessToken,
   // generateRefreshToken,
};
