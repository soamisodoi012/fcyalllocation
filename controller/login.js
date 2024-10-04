const User = require('../model/user');  // Adjust according to your user model path
const { generateAccessToken } = require('../middleware/security');
const pool = require('../config/database');  // Assuming you're using a pool connection for raw SQL queries

const login = async (req, res, next) => {
    const { username } = req.body;

    try {
        // Find the user by username and password
        const user = await User.findOne({ where: { username } });
        //if (!user.isPasswordChanged)
        console.log(user)
        if(!user.isPasswordChanged){
         /// changePassword(user.username)
            return res.status(403).json({ message: 'Password change required', username: user.username });
        }

        else if (user) {
            // Check if the session already exists
            const existingSession = await pool.query('SELECT * FROM Session WHERE user = $1', [user.username]);

            if (existingSession.rows.length > 0) {
                // Session exists, prevent login
                return res.status(403).json({ message: 'User already logged in' });
            }

            // Generate the access token
            //const token = generateAccessToken(user);

            // Insert a new session
            await pool.query('INSERT INTO Session (user, token) VALUES ($1, $2)', [user.username, token]);

            // Respond with the new token
            res.status(200).json({ message: 'Login successful', token });
        } else {
            res.status(401).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);  // Pass errors to the error handler middleware
    }
};
const changePassword = async (req, res) => {
    try {
      const { username, newPassword } = req.body; // Ensure userId is provided
  
      const user = await User.findByPk(username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.isPasswordChanged = true; // Set to true after changing the password
  
      await user.save();
  
      res.status(200).json({
        message: 'Password changed successfully',
        user,
      });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'An error occurred while changing the password' });
    }
  };
module.exports = {
    login,
    changePassword,
};
