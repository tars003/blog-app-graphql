const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

// Load the User and Post models
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

// Initialize the schema with references to the Sequelize models
const context = {
  User,
  Post,
  Comment,
};

const graphqlSetupMiddleware = graphqlHTTP((req) => ({
  schema,
  context: {
    ...context,
    // Pass the user information from the JWT to the GraphQL context
    user: req.user,
  },
  graphiql: true,
}));

module.exports =  graphqlSetupMiddleware ;
