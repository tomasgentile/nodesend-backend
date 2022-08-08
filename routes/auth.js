import express from 'express';
import { check } from 'express-validator';
import { authUser, userData } from '../controllers/authController.js';
import checkAuth from '../middleware/checkAuth.js';
const router = express.Router();

router.post('/', [
    check('email', 'Agregar un email válido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty()
], authUser);

router.get('/', checkAuth, userData);

export default router;