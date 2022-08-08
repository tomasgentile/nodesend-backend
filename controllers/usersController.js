import Users from '../models/Users.js';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

const newUser = async (req, res) => {
    // Error Messages 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Verify if the user already exists
    const { email, password } = req.body;
    let existeingUser = await Users.findOne({ email });
    if (existeingUser) {
        return res.status(400).json({ msg: 'El usuario ya esta registrado' });
    }

    const user = new Users(req.body);
    // Password Hash
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    try {
        await user.save();
        res.json({ msg: 'Usuario creado correctamente' });
    } catch (error) {
        console.log(error);
    }
}

export { newUser };

