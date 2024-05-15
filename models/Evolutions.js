// Import necessary modules from Sequelize
const { Model, DataTypes } = require('sequelize');
// Import the Sequelize connection from the configuration file
const sequelize = require('../config/connection');

// Define the Evolution model class, extending the Sequelize Model class
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
);

// Export the Evolution model for use in other parts of the application
module.exports = Evolution;
