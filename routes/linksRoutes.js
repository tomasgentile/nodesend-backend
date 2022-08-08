import express from 'express';
import { check } from 'express-validator';
import checkAuth from '../middleware/checkAuth.js';
import { newLink, getLink, getLinks, linkWithPassword, verifyPassword } from '../controllers/linksController.js';
const router = express.Router();

router.post('/', [
    check('name', 'Sube un archivo').not().isEmpty(),
    check('original_name', 'Sube un archivo').not().isEmpty()
], checkAuth, newLink);

router.get('/', getLinks);
router.get('/:url', linkWithPassword, getLink);
router.post('/:url', verifyPassword, getLink);

export default router;