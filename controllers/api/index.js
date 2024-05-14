const router = require('express').Router();
// Add in routes
const loginRoutes = require('./loginRoutes.js')
router.use('/users', loginRoutes)
module.exports = router;
