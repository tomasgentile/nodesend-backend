import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import Users from '../models/Users.js';

const authUser = async (req, res, next) => {
    // Error check
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Find registered user
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
        res.status(401).json({ msg: "El usuario no existe" });
        return next();
    }

    // Password check
    if (bcrypt.compareSync(password, user.password)) {
        // Create JWT
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email
        }, process.env.PRIVATE_KEY, {
            expiresIn: '8h'
        });
        res.json({ token });
    } else {
        res.status(401).json({ msg: 'Password incorrecto' });
        return next();
    }
}

const userData = async (req, res) => {
    res.json({ user: req.user });
}

export { authUser, userData }