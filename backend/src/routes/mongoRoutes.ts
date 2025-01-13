import express from 'express';
import { selectAllDiscussions } from '../services/databaseServices'; // Import the selectAllDiscussions function
//https://chatgpt.com/share/67853c32-19b8-8001-bee5-95db4a21368d
const router = express.Router();
//npm install express mongoose jsonwebtoken
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Token = require('./models/token'); // Import the Token model

const app = express();
app.use(express.json()); // To parse JSON request bodies

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/your-db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Route to receive token and permissions and save it
app.post('/assign-token', async (req, res) => {
  const { userEmail, dietitianEmail, permissions } = req.body;

  // Check if all necessary data is provided
  if (!userEmail || !dietitianEmail || !permissions || !Array.isArray(permissions)) {
    return res.status(400).json({ message: 'Invalid request. Please provide userEmail, dietitianEmail, and permissions.' });
  }

  try {
    // Generate JWT token for the professional (dietitian)
    const tokenPayload = {
      email: userEmail,
      dietitianEmail,
      permissions: permissions.filter((perm) => perm.granted).map((perm) => perm.category), // Filter granted permissions
    };

    const token = jwt.sign(tokenPayload, 'your-secret-key', { expiresIn: '1h' }); // JWT with 1 hour expiration

    // Check if token already exists for the user
    const existingToken = await Token.findOne({ email: userEmail });

    if (existingToken) {
      // If a token already exists, update it
      existingToken.token = token;
      existingToken.permissions = permissions;
      existingToken.updatedAt = Date.now();
      await existingToken.save();
    } else {
      // If no token exists, create a new one
      const newToken = new Token({
        email: userEmail,
        token,
        permissions,
        expiresAt: new Date(Date.now() + 3600 * 1000), // Set expiration time (1 hour)
      });
      await newToken.save();
    }

    // Respond with success message and the generated token
    return res.status(201).json({ message: 'Token assigned successfully!', token });
  } catch (error) {
    console.error('Error saving token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the Express server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Route to get all discussions
router.get('/discussions', async (req, res) => {
  try {
    const discussions = await selectAllDiscussions();
    res.status(200).json(discussions);
  } catch (error) {
    console.error('Error in /discussions route:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;