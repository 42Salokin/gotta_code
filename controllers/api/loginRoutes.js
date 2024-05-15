const router = require('express').Router();
const bcrypt = require('bcrypt'); // For password hashing
const { User } = require('../../models');



// Middleware to parse incoming request bodies as JSON
router.post('/', async (req, res) => {
  console.log(req.body)
  try {
    const signupuser = await User.create(req.body)
    console.log(req.body)
    req.session.save(() => {
      req.session.user_id = signupuser.id
      req.session.name = signupuser.name
      req.session.logged_in = true
    })
    res.status(200).json(signupuser)
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
})

// Login route handler (replace '/api/users/login' with your desired endpoint)
router.post('/login', async (req, res) => {
  const { username, email, password } = req.body;
  console.log("hello world")

  // Validate input (replace with more robust validation)
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, email, password are required' });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username: req.body.username } });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!email) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password hashes (assuming password is hashed in the database)
    const passwordMatch = await user.checkPassword(req.body.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Login successful (replace with session management or token generation)
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.username = user.username;
      req.session.logged_in = true;

      res.status(200).json({
        user,
        message: 'You are now logged in!',
      });
    });

  } catch (error) {
    console.error(error);
    // Check the error type and respond with a more specific status code and message
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'Username already exists' });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end()
    })
  }
  else {
    res.status(404).end()
  }
})

module.exports = router
