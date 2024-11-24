const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authControllers');

// Rota de cadastro
router.post('/cadastro', registerUser);

// Rota de login
router.post('/login', loginUser);

module.exports = router;
