const { Team } = require('../models');

exports.createTeam = async (req, res) => {
  try {
    const { teamName } = req.body;

    if (!teamName) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    const newTeam = await Team.create({ teamName });
    res.status(201).json(newTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};