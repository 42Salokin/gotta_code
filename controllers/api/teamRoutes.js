const router = require('express').Router();
const { Op } = require('sequelize');
const withAuth = require('../../utils/auth');
const { Pokemon } = require('fast-poke-fetch');
const { Pokes, Evolutions, Team } = require('../../models');

function cap(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

router.get('/', withAuth, async (req, res) => {
    const teamList = await Team.findAll();
    console.log(teamList);
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

  router.delete('/:deleteName', async (req, res) => {
    const deleteName = req.params.deleteName;

    try {
        // Find the team with the specified name or containing the specified Pokemon
        const team = await Team.findOne({
            where: {
                [Op.or]: [
                    { name: deleteName },
                    { pokemon1: deleteName },
                    { pokemon2: deleteName },
                    { pokemon3: deleteName },
                    { pokemon4: deleteName },
                    { pokemon5: deleteName },
                    { pokemon6: deleteName }
                ]
            }
        });

        if (!team) {
            console.log(`No team or Pokemon found with name ${deleteName}.`);
            return res.status(404).json({ message: `No team or Pokemon found with name ${deleteName}.` });
        }
        // console.log(team);
        // Remove the Pokemon from the team
        if (team.name === deleteName) {
            // Remove the entire team if the name matches
            await team.destroy();
            console.log(`Team ${deleteName} deleted successfully.`);
            res.status(200).json({ message: `Team ${deleteName} deleted successfully.` });
            // return res.redirect('/api/team');
            // res.render('team');
        } else {
            // Otherwise, remove the Pokemon from the team
            const columns = ['pokemon1', 'pokemon2', 'pokemon3', 'pokemon4', 'pokemon5', 'pokemon6'];
            for (const column of columns) {
                if (team[column] === deleteName) {
                    team[column] = '';
                }
            }
            await team.save();
            console.log(`Pokemon ${deleteName} removed from team.`);
            res.status(200).json({ message: `Pokemon ${deleteName} removed from team.` });
            // res.redirect('/api/team');
            // res.render('team');
        }
    } catch (error) {
        console.error('Error deleting Pokemon from team:', error);
        return res.status(500).json({ message: 'Failed to delete Pokemon from team.' });
    }
});


module.exports = router;
