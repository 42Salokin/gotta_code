const router = require('express').Router();
const withAuth = require('../utils/auth');
const {User} = require('../models')
// const { Pokemon } = require('fast-poke-fetch');
// const { Pokes, Evolutions } = require('../models');

router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged-in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
    });

    const user = userData.get({ plain: true });
console.log("===========================================================================")
    console.log(user)
    console.log("===========================================================================")
    // Pass user data to the Handlebars template
    res.render('profile', {
     user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
 
router.get('/', async (req, res) => {
    try {
      console.log(req.session.logged_in);
        res.render('homepage', {
          logged_in: req.session.logged_in
        });
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
  });  
  
  router.get('/login', (req, res) => {
    try {
      res.render('login')
    } catch (err) {
      console.error(err)
      res.status(500).json(err)
    }
  });

  module.exports = router;

  