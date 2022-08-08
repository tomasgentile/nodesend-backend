import Links from '../models/Links.js';
import shortid from 'shortid';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

const newLink = async (req, res) => {
    // Error check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Create Link Object
    const { original_name, name } = req.body;
    const link = new Links();
    link.url = shortid.generate();
    link.name = name;
    link.original_name = original_name;

    // Authenticated Users
    if (req.user) {
        const { password, downloads } = req.body;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            link.password = await bcrypt.hash(password, salt);
        }
        if (downloads) {
            link.downloads = downloads;
        }
        link.author = req.user.id;
    }

    // Store Link in DB
    try {
        await link.save();
        return res.json({ url: link.url });
    } catch (error) {
        console.log(error);
    }
}

// Get a list of all links
const getLinks = async (req, res) => {

    try {
        const links = await Links.find({}).select('url -_id');
        res.json({ links });
    } catch (error) {
        console.log(error);
    }
}

const getLink = async (req, res, next) => {
    // Check if the link exists
    const { url } = req.params;
    const link = await Links.findOne({ url });

    if (!link) {
        res.status(404).json({ msg: 'Ese enalce no existe' });
        return next();
    }
    res.json({
        file: link.name,
        password: false
    });
    next();
}

const linkWithPassword = async (req, res, next) => {
    // Check if the link exists
    const { url } = req.params;
    const link = await Links.findOne({ url });

    if (!link) {
        return next();
    }

    if (link.password) {
        return res.json({ password: true, link: link.url });
    }
    next();
}

const verifyPassword = async (req, res, next) => {
    const { url } = req.params;
    const { password } = req.body;

    const link = await Links.findOne({ url });

    // Check Password
    if (bcrypt.compareSync(password, link.password)) {
        next();
    } else {
        return res.status(401).json({ msg: 'Password Incorrecto' });
    }
}

export { newLink, getLink, getLinks, linkWithPassword, verifyPassword }