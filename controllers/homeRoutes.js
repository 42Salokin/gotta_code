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
  
      const requestedPoke = dbPokemonData.get({ plain: true });
    //   res.render('search', { requestedPoke });
      res.json(dbPokemonData);
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
