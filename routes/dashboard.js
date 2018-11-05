const express = require("express");

const router = express.Router();

// Display the dashboard

router.get("/", (req, res) => {
  res.render("login");
});

module.exports = router;
