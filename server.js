const express = require('express');
const FcyInAuRoutes = require('./route/FcyInAuRoute');
const userRoutes = require('./route/userRoute');
const branchRoute=require('./route/branchRoute');
const app = express();
require('dotenv').config();
const port = process.env.APP_PORT;
app.use(express.json());
app.use('', FcyInAuRoutes);
app.use('', userRoutes);
app.use('', branchRoute);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});