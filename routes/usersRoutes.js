import express from 'express';
import { check } from 'express-validator';
const router = express.Router();
import { newUser } from '../controllers/usersController.js';

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'La clave debe tener al menos 6 caracteres').isLength({ min: 6 })
], newUser);

export default router;