import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

import projectRoutes from './routes/project.js';
app.use('/api/projects', projectRoutes);
import userRoutes from './routes/users.js';
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/signup', async (req, res) => {
    try {
        const { f_name, l_name, username, password } = req.body;
        if (!f_name || !l_name || !username || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists.' });
        }
        const newUser = new User({ f_name, l_name, username, password });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server or database error occurred.' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Please enter both username and password.' });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({message: 'Username does not exist.'});
        }
        if (user.password !== password) {
            return res.status(400).json({ message: 'Incorrect password.' });
        }

        res.status(200).json({ message: `Welcome back, ${user.f_name}! Login successful.` });
    } catch (error) {
        res.status(500).json({ message: 'Server or database error occurred.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));