const express = require('express');
const bcrypt = require('bcrypt'); // For password hashing
const User = require('./models/user'); 

const app = express();

// Middleware to parse incoming request bodies as JSON
app.use(express.json());

// Login route handler (replace '/api/users/login' with your desired endpoint)
app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate input (replace with more robust validation)
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password hashes (assuming password is hashed in the database)
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Login successful (replace with session management or token generation)
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ... other application routes

app.listen(3000, () => console.log('Server listening on port 3000'));
