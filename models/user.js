// models/user.js
const {  DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Post = require('./post');
const Comment = require('./comment');


const User = sequelize.define('User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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

User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, process.env.SALT_ROUNDS);
  }
});

// Define associations
User.associate = (models) => {
  User.hasMany(Post, { foreignKey: 'author_id', as: 'posts' });
  User.hasMany(Comment, { foreignKey: 'author_id', as: 'comments' });
};

module.exports = User;