const express = require('express');

const router = express.Router();

var path = require('path');

// Home page
router.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/cart.html'));
});

module.exports = router;
