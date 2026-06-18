// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', authRoutes);

// Serve the front-end (your existing HTML/CSS/JS) from /public
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`FF Diamonds server running at http://localhost:${PORT}`);
});
