const express = require('express');
const { registro, login, perfil } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.post('/registro', asyncHandler(registro));
router.post('/login', asyncHandler(login));
router.get('/perfil', authMiddleware, perfil);

module.exports = router;
