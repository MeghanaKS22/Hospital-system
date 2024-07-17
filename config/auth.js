const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('./routes/index.js/ensureAuthenticated');

router.get('/protected-route', ensureAuthenticated, (req, res) => {
    res.send('You have accessed a protected route!');
});

module.exports = router;
