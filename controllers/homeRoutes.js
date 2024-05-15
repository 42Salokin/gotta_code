const router = require('express').Router();
const { Pokemon } = require('fast-poke-fetch');
const { Pokes, Evolutions } = require('../models');
 
router.get('/', async (req, res) => {
    try {
        res.render('homepage');
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

//   GET one pokemon
  router.get('/pokemon/:name', async (req, res) => {
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
      
      function cap(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
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
        } else if (method1.held_item) {                            //evolves by being traded while holding an item
            pokemon.trigger = `By being traded while holding a ${cap(method1.held_item)}`;
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
        } else if (method2.held_item) {                            //evolves by being traded while holding an item
            pokemon.trigger = `By being traded while holding a ${cap(method2.held_item)}`;
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

      res.render('search', { pokemon });
    //   res.json(pokemon);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  router.get('/signup', (req, res) => {
    try {
      res.render('login')
    } catch (err) {
      console.error(err)
      res.status(500).json(err)
    }
  })
  
  
  router.get('/login', (req, res) => {
    try {
      res.render('login')
    } catch (err) {
      console.error(err)
      res.status(500).json(err)
    }
  })

  module.exports = router;
