const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const validateSignup = require('../middleware/validator.js');
const rateLimiter= require('../middleware/rateLimit.js');

const userCtrl = require('../controllers/user.js');

router.post('/signup', validateSignup, userCtrl.signup);
router.post('/login', rateLimiter, userCtrl.login);

module.exports = router;