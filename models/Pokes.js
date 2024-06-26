// Import necessary modules from Sequelize
const { Model, DataTypes } = require('sequelize');
// Import the Sequelize connection instance
const sequelize = require('../config/connection');

// Define a new class called Pokemon that extends Sequelize's Model class
class Pokes extends Model {}

// Initialize the Pokemon model with its attributes and options
Pokes.init(
  {
    // Define the id attribute
    id: {
      type: DataTypes.INTEGER, 
      primaryKey: true,
      autoIncrement: true 
    },
    // Define the name attribute
    name: {
      type: DataTypes.STRING, 
      allowNull: false 
    },
    // Define the type attribute
    type1: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    type2: {
      type: DataTypes.STRING, 
      allowNull: true
    },
    // Define the evolves_to attribute
    evolves_to: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pokedex: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false 
    },    
    // evolution_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true, 
    //   references: {
    //     model: 'Evolutions', // Name of the referenced model
    //     key: 'id' // Key in the referenced model
    //   }
    // }
  },
  {
    // Provide the Sequelize connection instance
    sequelize,
    // Configure options for the model
    timestamps: false, // Disable timestamps (createdAt and updatedAt)
    freezeTableName: true, // Prevent Sequelize from pluralizing the table name
    underscored: true, // Use underscores in column names instead of camelCase
    modelName: 'pokemon' // Set the model name to 'pokemon'
  }
);

// Export the Pokemon model for use in other parts of the application
module.exports = Pokes;

