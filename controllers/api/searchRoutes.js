const router = require('express').Router();
const { Pokemon } = require('fast-poke-fetch');
const { Pokes, Evolutions } = require('../../models');
const withAuth = require('../../utils/auth');

function cap(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
    }

router.get('/', withAuth, async (req, res) => {
    try {
        console.log(req.session.logged_in);
        res.render('search', {
            logged_in: req.session.logged_in
          });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  //   GET one pokemon
  router.get('/:name', withAuth, async (req, res) => {
    const getId = await Pokemon(req.params.name)
    console.log(getId);
    try {
        const dbPokemonData = await Pokes.findByPk(getId.id, {
            include: [
                {
                    model: Evolutions,
                    attributes: ['stage1', 'stage2', 'trigger1', 'trigger_details1', 'stage3', 'trigger2', 'trigger_details2'], 
                },
            ],
        });
        

      if (!dbPokemonData) {
        return res.status(404).json({ message: 'Pokemon not found' });
      }
    
      const pokemondata = dbPokemonData.get({ plain: true });
      const id = pokemondata.id;
      const name = cap(pokemondata.name);
      const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemondata.id}.png`;
      let type;
      let evolution;

      switch (pokemondata.type2) {
        case null:
            type = cap(pokemondata.type1);
            break;
      
        default:
            type = `${cap(pokemondata.type1)}/${cap(pokemondata.type2)}`;
            break;
      }

      switch (pokemondata.evolves_to) {
        case null:
            evolution = "Doesn't evolve";
            break;
      
        default:
            evolution = `Evolves to ${cap(pokemondata.evolves_to)}`
            break;
      }

      const pokemon = {
        id,
        name,
        sprite,
        type,
        evolution
      }

      const method1 = pokemondata.evolution.trigger_details1;
      const method2 = pokemondata.evolution.trigger_details2;

      if ((pokemondata.name === pokemondata.evolution.stage1) && (pokemondata.evolves_to)) { //if it's stage 1 and evolves
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
      } else if ((pokemondata.name === pokemondata.evolution.stage2) && (pokemondata.evolves_to)) { //if it's stage 2 and evolves
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
      console.log(req.session.logged_in);
      res.render('search', { pokemon,
        logged_in: req.session.logged_in
       });
      // res.json(pokemon);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  router.get('/addToPokedex/:id', async (req, res) => {
    const pokemonId = req.params.id;
    await Pokes.update({ pokedex: true }, { where: { id: pokemonId } });
    const pokeName = await Pokemon(pokemonId)
    res.json({ message: `Congratulations! ${cap(pokeName.name)} was added to your Pokedex!` });
});


  // This is a rough setup to provide name recommendations based on user input in the search bar
// router.get('/:query', async (req, res) => {
//     try {
//         // Retrieve the query parameter from the request
//         const query = req.params.query;

//         // Perform a database query to find pokemons matching the query
//         const pokemons = await Pokes.findAll({
//             where: {
//                 name: { [Sequelize.Op.like]: `%${query}%` } // Use Sequelize operators for a fuzzy search
//             }
//         });

//         // Return the matching pokemons as JSON response
//         res.json(pokemons);
//     } catch (error) {
//         // If an error occurs, send back an error response
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while processing your request' });
//     }
// });

module.exports = router;
