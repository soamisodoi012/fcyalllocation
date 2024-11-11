const jwt = require('jsonwebtoken');
const Session = require('../model/session');

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
// Initialize tokenBlacklist as a Set
const tokenBlacklist = new Set();

const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        // Check for the presence of the token
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1]; // Extract token

        // Check if the token is already blacklisted
        if (tokenBlacklist.has(token)) {
            return res.status(403).json({ message: 'Token is blacklisted' });
        }

        // Decode the token without verifying it to check expiration
        const decoded = jwt.decode(token);

        // If the token is expired, blacklist it
        if (decoded && decoded.exp * 1000 < Date.now()) {
            tokenBlacklist.add(token);
            return res.status(403).json({ message: 'logout successful' });
        }

        // Verify the token to ensure it’s valid (not expired) and get the user information
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
            if (err) {
                // Token is invalid or expired, handle accordingly
                tokenBlacklist.add(token); // Blacklist invalid token
                return res.status(403).json({ message: 'Invalid token, logout successful' });
            }
        });

        // Add the token to the blacklist
        tokenBlacklist.add(token);

        // Destroy the session for the user associated with the token
        await Session.destroy({ where: { user: decoded.username } });

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

module.exports = {
    logout,
};