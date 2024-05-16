const router = require('express').Router();
const { createTeam } = require('../controllers/teamController');

router.post('/teams', createTeam);

module.exports = router;
