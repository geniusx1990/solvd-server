const express = require('express');

const router = express.Router();

const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddlware');

router.post('/users', UserController.createUser);
router.get('/users', authMiddleware,UserController.getUsers);
router.get('/users/:id', UserController.getUser);
router.put('/users', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);




module.exports = router;
