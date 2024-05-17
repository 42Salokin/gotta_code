const router = require('express').Router();
// Add in routes
const loginRoutes = require('./loginRoutes.js')
const searchRoutes = require('./searchRoutes.js')
const pokedexRoutes = require('./pokedexRoutes.js')
const teamRoutes = require('./teamRoutes.js')

router.use('/users', loginRoutes)
router.use('/search', searchRoutes)
router.use('/pokedex', pokedexRoutes)
router.use('/team', teamRoutes)

module.exports = router;
