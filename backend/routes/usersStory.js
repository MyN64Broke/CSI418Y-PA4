import express from "express";
const router = express.Router();
import Project from '../models/Project.js';
import UserStory from '../models/UserStory.js';
import ProjectMembership from "../models/ProjectMembership.js";

router.get('/:project_id/stories', async (req, res) => {
    try {
        const { project_id } = req.params;
        const stories = await UserStory.find({ project_id })
            .populate('assigned_user_id', 'f_name l_name username');

        res.status(200).json(stories);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stories', details: err.message });
    }
});

router.post('/:project_id/stories', async (req, res) => {
   try{
       const {project_id, title, description, priority, assigned_user_id} = req.body;
       const project = await Project.findById(project_id);
       if(!project){
           res.status(400).json({error: 'Project not found'});
       }
       if(assigned_user_id){
           const projectMembership = await ProjectMembership.findOne({
               project_id: project_id,
               user_id: assigned_user_id
           });
           if(!projectMembership){
               res.status(400).json({error: 'User is not a member of this project'});
           }
       }
       const newStory = new UserStory({
          project_id: project_id,
          title: title,
          description: description,
          priority: priority,
           status: 'To-Do',
          assigned_user_id: assigned_user_id || null
       });
       const savedStory = await newStory.save();
       res.status(201).json(savedStory);
   } catch(err){
       res.status(500).json({error: 'Failed to create new story.', details: err.message});
   }
});

router.put('/:project_id/stories/:id', async (req, res) => {
    try{
        const {project_id} = req.params;
        const {title, description, priority, status, assigned_user_id} = req.body;
        const story = await UserStory.findById(req.params.id);
        if(!story){
            return res.status(400).json({error: 'User Story not found'});
        }
        if (assigned_user_id !== undefined && assigned_user_id !== story.assigned_user_id?.toString()) {
            if (assigned_user_id && assigned_user_id !== '') {
                const projectMembership = await ProjectMembership.findOne({
                    project_id: project_id,
                    user_id: assigned_user_id
                });
                if (!projectMembership) {
                    return res.status(400).json({ error: 'User is not a member of this project' });
                }
                story.assigned_user_id = assigned_user_id;
            } else {
                story.assigned_user_id = null;
            }
        }
        if(title) story.title = title;
        if(description) story.description = description;
        if(priority) story.priority = priority;
        if(status) story.status = status;
          
        await story.save();
        const populatedStory = await UserStory.findById(story._id).populate('assigned_user_id', 'f_name l_name');
        return res.status(200).json(populatedStory);
    } catch(err){
        return res.status(400).json({error: 'Failed to update story.', details: err.message});
    }
});

router.delete('/:project_id/stories/:id', async (req, res) => {
   try{
       const deletedStory = await UserStory.findByIdAndDelete(req.params.id);
       if(!deletedStory){
           return res.status(404).json({error: 'User Story not found'});
       }
       return res.status(200).json({message: 'User story deleted successfully.'});
   } catch(err){
       return res.status(500).json({error: 'Failed to delete story.', details: err.message});
   }
});

export default router;