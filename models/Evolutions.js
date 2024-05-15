// Import necessary modules from Sequelize
const { Model, DataTypes } = require('sequelize');
// Import the Sequelize connection from the configuration file
const sequelize = require('../config/connection');

// Define the Evolution model class, extending the Sequelize Model class
 logout
class Evolution extends Model { }

// Initialize the Evolution model with its attributes and options
Evolution.init(
    {
        // Define the 'id' attribute as an INTEGER type, primary key, and auto-incrementing
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // Define the 'trigger' attribute as a STRING type, not allowing null values
        trigger: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Define the 'min_level' attribute as an INTEGER type, not allowing null values
        min_level: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        // Provide configuration options for the model
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'evolution'
    }

class Evolutions extends Model {}

// Initialize the Evolution model with its attributes and options
Evolutions.init(
  {
    // Define the 'id' attribute as an INTEGER type, primary key, and auto-incrementing
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    stage1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Define the 'trigger' attribute as a STRING type, not allowing null values
    trigger1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Define the 'trigger_details1' attribute as JSON type, allowing null values
    trigger_details1: {
      type: DataTypes.JSON,
      allowNull: true
    },
    stage2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    trigger2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // Define the 'trigger_details2' attribute as JSON type, allowing null values
    trigger_details2: {
      type: DataTypes.JSON,
      allowNull: true
    },
    stage3: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    // Provide configuration options for the model
    sequelize, 
    timestamps: false, 
    freezeTableName: true, 
    underscored: true, 
    modelName: 'evolutions' 
  }
 main
);


// Export the Evolution model for use in other parts of the application
module.exports = Evolutions;
