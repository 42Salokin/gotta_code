const router = require('express').Router();
// const { Pokemon } = require('fast-poke-fetch');
// const { Pokes, Evolutions } = require('../models');
 
router.get('/', async (req, res) => {
    try {
        res.render('homepage');
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
