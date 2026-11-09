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
/*
This code should be implemented if we ever wanted to remove a user to make sure their backlogs are reassigned
const assignedStoriesCount = await UserStory.countDocuments({
            project_id: project_id,
            user_id: user_id
        });
        if(assignedStoriesCount > 0){
            return res.status(400).json({ 
                message: 'Cannot remove user.', 
                details: 'User is still assigned to ${assignedStoriesCount} stories. Please reassign or remove their stories before removing them.}' });
        }
 */
export default router;