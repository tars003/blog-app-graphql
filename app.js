// app.js
const express = require('express');
require('dotenv').config();

const sequelize = require('./config/database');
const jwtMiddleware = require('./middleware/authMiddleware');
const authRouter = require('./routes/authRoute');
const graphqlSetupMiddleware = require('./graphql/graphqlSetup');

// Sync the models with the database
sequelize.sync();


const app = express();
app.use(express.json());
// Middleware to check JWT and add user to request
app.use(jwtMiddleware);
// Use the authRoutes middleware for authentication
app.use(authRouter);
// Use the graphqlSetupMiddleware middleware for GraphQL
app.use('/graphql', graphqlSetupMiddleware);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
