const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const profileRoutes = require('./profileRoutes')

router.use('/', homeRoutes);
router.use('/profile', profileRoutes)
router.use('/api', apiRoutes);

// router.use((req, res) => {
//     res.send("<h1>Wrong Route!</h1>")
// });

module.exports = router;