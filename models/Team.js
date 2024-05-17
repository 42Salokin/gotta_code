const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Team extends Model {}

Team.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pokemon1: {
      type: DataTypes.STRING,
      allowNull: true // Adjust this if you want to allow empty slots in the team
    },
    pokemon2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pokemon3: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pokemon4: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pokemon5: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pokemon6: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'team'
  }
);
  



module.exports = Team;