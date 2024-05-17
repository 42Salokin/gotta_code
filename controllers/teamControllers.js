const router = require('express').Router();
const { Pokemon } = require('fast-poke-fetch');
const { Pokes, Evolutions, Team } = require('../models');

// Export an asynchronous function named createTeam that handles the creation of a new team
exports.createTeam = async (req, res) => {
  try {
    const { team_name, pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon6 } = req.body;

    // Check if the team name is provided
    if (!team_name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    // Create a new team with the provided data
    const newTeam = await Team.create({
      team_name,
      pokemon1,
      pokemon2,
      pokemon3,
      pokemon4,
      pokemon5,
      pokemon6
    });

    // Send a success response with the created team
    res.status(201).json(newTeam);
  } catch (error) {
    console.error(error);
    // Send an error response if something goes wrong
    res.status(500).json({ message: 'Internal server error' });
  }
};