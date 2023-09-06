// userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/list', userController.listUsers);
router.get('/age', authMiddleware, userController.calculateAge);

module.exports = router;
