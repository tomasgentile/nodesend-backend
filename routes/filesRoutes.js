import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { uploadFile, download, deleteFile } from '../controllers/filesController.js';

const router = express.Router();

router.post('/', checkAuth, uploadFile);
router.get('/:file', download, deleteFile);

export default router;