// Import the models for Pokes, Evolutions, Team, and User
const Pokes = require('./Pokes');
const Evolutions = require('./Evolutions');
const Team = require('./Team'); 
const User = require('./User');

// Define a one-to-many relationship where a Poke can have many Evolutions
Pokes.hasMany(Evolutions, {
  foreignKey: 'poke_id', 
  onDelete: 'CASCADE'
});

// Define a many-to-one relationship where an Evolution belongs to a single Poke
Evolutions.belongsTo(Pokes, {
  foreignKey: 'poke_id'
});

// Define a one-to-many relationship where a User can have many Teams
User.hasMany(Team, {
  foreignKey: 'user_id', 
  onDelete: 'CASCADE'
});

// Define a many-to-one relationship where a Team belongs to a single User
Team.belongsTo(User, {
  foreignKey: 'user_id' 
});

// Export the models and associations for use in other parts of the application
module.exports = { Pokes, Evolutions, Team, User };
