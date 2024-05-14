// Import necessary modules
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

// Define the User model class, extending Sequelize's Model class
class User extends Model {
  // Method to check if a password matches the hashed password stored in the database
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// Initialize the User model with its attributes and options
User.init(
  {
    // Define the id attribute
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // Define the name attribute
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Define the email attribute
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Validate that the email is in the correct format
      },
    },
    // Define the password attribute
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8], // Validate that the password has a minimum length of 8 characters
      },
    },
  },
  {
    // Define hooks to run before creating and updating a user
    hooks: {
      beforeCreate: async (newUserData) => {
        // Hash the password before creating a new user
        newUserData.password = await bcrypt.hash(newUserData.password, 10); 
        return newUserData;
      },
      beforeUpdate: async (updatedUserData) => {
        // Hash the password before updating a user
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10); 
        return updatedUserData;
      },
    },
    // Provide the Sequelize connection instance
    sequelize,
    // Configure options for the model
    timestamps: false, 
    freezeTableName: true, 
    underscored: true, 
    modelName: 'user', 
  }
);

// Export the User model for use in other parts of the application
module.exports = User;
