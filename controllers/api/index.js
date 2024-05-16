const router = require('express').Router();
// Add in routes
const loginRoutes = require('./loginRoutes.js')
const searchRoutes = require('./searchRoutes.js')
const pokedexRoutes = require('./pokedexRoutes.js')

router.use('/users', loginRoutes)
router.use('/search', searchRoutes)
router.use('/pokedex', pokedexRoutes)

module.exports = router;
