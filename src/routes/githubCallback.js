// src/routes/githubCallback.js
const express = require('express');
const router = express.Router();

router.get('/callback', (req, res) => {
  const { code } = req.query;
  // Redirige al frontend con el code
  res.redirect(`http://localhost:5173/login?code=${code}`);
});

module.exports = router;
