const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');


// Load the User and Post models
const User = require('./user');
const Comment = require('./comment');


const Post = sequelize.define('Post',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
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

Post.associate = (models) => {
  Post.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
  Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' });
};

module.exports = Post;

