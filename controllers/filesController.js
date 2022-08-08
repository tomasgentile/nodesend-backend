import multer from 'multer';
import shortid from 'shortid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Links from '../models/Links.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadFile = async (req, res, next) => {
    const multerConfig = {
        limits: { fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads');
            },
            filename: (req, file, cb) => {
                const name = shortid.generate();
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${name}${extension}`)
            }
        })
    }
    const upload = multer(multerConfig).single('file');

    upload(req, res, async (error) => {
        if (!error) {
            res.json({ file: req.file.filename });
        } else {
            console.log(error);
            return next();
        }
    });
}

const deleteFile = async (req, res) => {
    try {
        const path = __dirname.substring(0, __dirname.length - 12);
        fs.unlinkSync(`${path}/uploads/${req.file}`);
    } catch (error) {
        console.log(error);
    }
}

// Download File
const download = async (req, res, next) => {
    // Get Link
    const { file } = req.params;
    const link = await Links.findOne({ name: file });
    const { downloads, name, _id } = link;

    const path = __dirname.substring(0, __dirname.length - 12);
    const fileDownload = `${path}/uploads/${name}`;

    res.download(fileDownload);

    // Delete Files 
    if (downloads === 1) {        // One Download
        req.file = name;

        // Delete Link in BD
        await Links.findByIdAndRemove(_id);

        next();
    } else {
        // More than one downloads
        link.downloads--;
        await link.save();
    }
}

export { uploadFile, deleteFile, download }