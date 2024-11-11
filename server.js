// const express = require('express');
// const FcyInAuRoutes = require('./route/FcyInAuRoute');
// const userRoutes = require('./route/userRoute');
// const branchRoute=require('./route/branchRoute');
// const {setupRolesAndPermissions}=require('./controller/rolePermissions');
// const currencyRoute=require('./route/currencyRoute');
// const app = express();
// require('dotenv').config();
// const port = process.env.APP_PORT;
// app.use(express.json());
// app.use('', FcyInAuRoutes);
// app.use('', userRoutes);
// app.use('', branchRoute);
// app.use('',currencyRoute);
// app.listen(3001, () => {
//   console.log(`Server is running on port ${port}`);
// });
const express = require('express');
const FcyInAuRoutes = require('./route/FcyInAuRoute');
const userRoutes = require('./route/userRoute');
const branchRoute = require('./route/branchRoute');
//const currencyRoute = require('./route/currencyRoute');
const ItemRoute = require('./route/ItemRoute');
const {setupRolesAndPermissions} = require('./controller/rolePermission'); // Import the setup function
require('dotenv').config();

const app = express();
const port = process.env.APP_PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api', FcyInAuRoutes);
app.use('/api', userRoutes);
app.use('/api', branchRoute);
app.use('/api', ItemRoute);
//app.use('/api', currencyRoute);

// Start the server with roles and permissions setup
const startServer = async () => {
    await setupRolesAndPermissions(); // Set up roles and permissions on server startup
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer().catch((error) => {
    console.error('Failed to start server:', error);
});
