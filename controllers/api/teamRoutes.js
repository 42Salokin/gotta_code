const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { createTeam } = require('../controllers/teamController');

router.post('/teams',withAuth, createTeam);

module.exports = router;
