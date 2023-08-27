const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Load the User and Post models
const User = require('./user');
const Post = require('./post');


const Comment = sequelize.define('Comment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true, 
    updatedAt: 'updated_at',
    createdAt: 'created_at', 
  }
);

Comment.associate = (models) => {
  Comment.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
  Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });
};

module.exports = Comment;
