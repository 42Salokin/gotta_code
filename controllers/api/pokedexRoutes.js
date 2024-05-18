const router = require('express').Router();
const { Pokemon } = require('fast-poke-fetch');
const { Pokes, Evolutions, Team } = require('../../models');
const withAuth = require('../../utils/auth');

function cap(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
    }

// Define a route to handle the GET request for the Pokedex
router.get('/', withAuth, async (req, res) => {
    try {
        // Query the database for all entries where pokedex property is true
        const dbpokedexEntries = await Pokes.findAll({
            where: { pokedex: true },
            include: [{
                model: Evolutions,
                attributes: ['stage1', 'stage2', 'trigger1', 'trigger_details1', 'stage3', 'trigger2', 'trigger_details2']
            }]
        });

        if (!dbpokedexEntries) {
            return res.status(404).json({ message: "You don't have any Pokemon in your Pokedex" });
          }
          
          const pokedexEntries = [];

        dbpokedexEntries.forEach(poke => {
            const id = poke.id;
            const name = cap(poke.name);
            const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`;
            let type;
            let evolution;

            switch (poke.type2) {
                case null:
                    type = cap(poke.type1);
                    break;
              
                default:
                    type = `${cap(poke.type1)}/${cap(poke.type2)}`;
                    break;
            }

            switch (poke.evolves_to) {
                case null:
                    evolution = "Doesn't evolve";
                    break;
              
                default:
                    evolution = `Evolves to ${cap(poke.evolves_to)}`
                    break;
            }

            const pokemon = {
                id,
                name,
                sprite,
                type,
                evolution
              }
        
              const method1 = poke.evolution.trigger_details1;
              const method2 = poke.evolution.trigger_details2;

              if ((poke.name === poke.evolution.stage1) && (poke.evolves_to)) { //if it's stage 1 and evolves
                if (method1.min_happiness) {                               //evolves by leveling up with a happiness rating
                    pokemon.trigger = `By leveling up with high friendship`;            //then adds trigger method to pokemon object
                } else if (method1.item) {                                 //evolves by using an item
                    pokemon.trigger = `By using a ${cap(method1.item)}`;
                    pokemon.itemSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${method1.item}.png`;
                } else if (method1.held_item) {                            //evolves by being traded while holding an item
                    pokemon.trigger = `By being traded while holding a ${cap(method1.held_item)}`;
                    pokemon.itemSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${method1.held_item}.png`;
                } else if (method1.known_move) {                           //evolves by leveling up while knowing a move
                    pokemon.trigger = `By leveling up while knowing ${cap(method1.known_move)}`;
                } else if (method1.trigger) {                              //evolves by getting three critical hits in the same battle
                    pokemon.trigger = 'By getting three critical hits in the same battle';
                } else {                                                   //evolves by leveling up
                    pokemon.trigger = `At level ${method1.min_level}`
                }
              } else if ((poke.name === poke.evolution.stage2) && (poke.evolves_to)) { //if it's stage 2 and evolves
                if (method2.min_happiness) {                               //evolves by leveling up with a happiness rating
                    pokemon.trigger = `By leveling up with high friendship`;            //then adds trigger method to pokemon object
                } else if (method2.item) {                                 //evolves by using an item
                    pokemon.trigger = `By using a ${cap(method2.item)}`;
                    pokemon.itemSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${method2.item}.png`;
                } else if (method2.held_item) {                            //evolves by being traded while holding an item
                    pokemon.trigger = `By being traded while holding a ${cap(method2.held_item)}`;
                    pokemon.itemSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${method2.held_item}.png`;
                } else if (method2.known_move) {                           //evolves by leveling up while knowing a move
                    pokemon.trigger = `By leveling up while knowing ${cap(method2.known_move)}`;
                } else if (method2.trigger) { 
                    if (method2.trigger === 'other') {                     //evolves by a unique trigger method                
                    pokemon.trigger = 'By using Rage Fist 20 times';
                    } else {
                        pokemon.trigger = 'By being traded';               //evolves by being traded
                    }
                } else if (method2.location) {                             //evolves by leveling up at a specific location
                    pokemon.trigger = `By leveling up at ${cap(method2.location)}`;
                } else {                                                   //evolves by leveling up
                    pokemon.trigger = `At level ${method2.min_level}`
                }
              }

              pokedexEntries.push(pokemon);
        });
        // Render the pokedex.handlebars view and pass the retrieved data
        res.render('pokedex', { pokedexEntries });
        // res.json(pokedexEntries)
    } catch (error) {
        // If an error occurs, send back an error response
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

router.get('/teamList', async (req, res) => {
    const teamList = await Team.findAll();
    if (teamList.length > 0) {
        res.json(teamList);
      } else {
        res.json({ message: "Please make a team on the Teams page" });
      }      
});

router.post('/addToTeam', async (req, res) => {
    try {
      // Destructure the data from the request body
      const { teamName, pokemonName } = req.body;
        console.log(teamName, pokemonName);
      // Find the team by its name
      const team = await Team.findOne({ where: { name: teamName } });
  
      // Check if the team exists
      if (!team) {
        console.log(`Team ${teamName} not found.`);
        return res.json({ message: `Team ${teamName} not found.` });
      }
    //   console.log(team);

      // Check if the pokemon is already in the team
      const pokemonColumns = ['pokemon1', 'pokemon2', 'pokemon3', 'pokemon4', 'pokemon5', 'pokemon6'];
      const pokemonIndex = pokemonColumns.findIndex(column => team[column] === pokemonName);
      if (pokemonIndex !== -1) {
        console.log(`${pokemonName} is already in ${teamName}.`);
        return res.json({ message: `${pokemonName} is already in ${teamName}.` });
      }
  
      // Check if the team has already reached its maximum capacity
      const numPokemon = pokemonColumns.filter(column => team[column] !== null && team[column] !== '').length;
    //   console.log(`numPokemon ${numPokemon}`);
      if (numPokemon >= 6) {
        console.log(`${teamName} is full.`);
        return res.json({ message: `${teamName} is full.` });
      }
  
      // Add the pokemon to the first available column
      const emptyColumn = pokemonColumns.find(column => team[column] === '');
      await team.update({ [emptyColumn]: pokemonName });
      console.log(emptyColumn);
  
      // Send a success response
      console.log(`${pokemonName} has been added to ${teamName}.`);
      return res.status(200).json({ message: `${pokemonName} has been added to ${teamName}.` });
    } catch (error) {
      console.error('Error adding pokemon:', error);
      return res.status(500).json({ message: 'Failed to add pokemon.' });
    }
  });


module.exports = router;
