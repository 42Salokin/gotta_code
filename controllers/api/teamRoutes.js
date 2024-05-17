const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { Pokemon } = require('fast-poke-fetch');
const { Pokes, Evolutions, Team } = require('../../models');

function cap(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

router.get('/', async (req, res) => {
    const teamList = await Team.findAll();
    if (teamList.length > 0) {
        // console.log(teamList);
        res.render('team', {teamList});
      } else {
        res.render('team');
      }      
});

router.post('/', async (req, res) => {
    try {
      // Destructure the data from the request body
      const { name, pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon6 } = req.body;
  
      // Create a new team entry in the database
      const newTeam = await Team.create({
        name,
        pokemon1,
        pokemon2,
        pokemon3,
        pokemon4,
        pokemon5,
        pokemon6
      });
  
      // Respond with the added team
      res.status(201).json(newTeam);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error adding team:', error);
      res.status(500).json({ message: 'Failed to add team' });
    }
  });




module.exports = router;
