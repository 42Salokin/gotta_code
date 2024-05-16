const router = require('express').Router();
// Add in routes
const loginRoutes = require('./loginRoutes.js')
const searchRoutes = require('./searchRoutes.js')

router.use('/users', loginRoutes)
router.use('/search', searchRoutes)

module.exports = router;
