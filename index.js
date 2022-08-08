import express from 'express';
import connectDB from './config/db.js';
import usersRoutes from './routes/usersRoutes.js';
import auth from './routes/auth.js';
import linksRoutes from './routes/linksRoutes.js';
import filesRoutes from './routes/filesRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';

// create server
const app = express();
// Dotenv
dotenv.config();
// connect DB
connectDB();
// Cors
const corsConfig = {
    origin: process.env.FRONTEND_URL
};
app.use(cors(corsConfig));
// App's port
const port = process.env.PORT || 4000;
// Enable to read Json
app.use(express.json());
// Public Folder
app.use(express.static('uploads'));
// App's Routes
app.use('/api/users', usersRoutes);
app.use('/api/auth', auth);
app.use('/api/links', linksRoutes);
app.use('/api/files', filesRoutes);
// Start app
app.listen(port, '0.0.0.0', () => {
    console.log('Servidor funcionando en el puerto ' + port);
});


