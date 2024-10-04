const jwt = require('jsonwebtoken');
const Session = require('../model/session');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1]; // Get the token

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET_KEY);

        // Invalidate the token by updating the session table
        await Session.update({ token: null }, { where: { user: decoded.username } });
        await Session.destroy({ where: { user: decoded.username } });

        return res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'Error during logout', error: error.message });
    }
};

module.exports = {
    logout,
};
