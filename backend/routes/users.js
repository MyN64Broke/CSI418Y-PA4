import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const users = await User.find().select('-password');
        res.status(200).json(users);
    }catch (e){
        console.error('Error fetching users:', e);
        res.status(500).json({message: 'A database or server error occured'});
    }
});

export default router;