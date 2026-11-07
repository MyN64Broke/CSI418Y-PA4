import express from "express";
const router = express.Router();
import User from '../models/User.js';
import Project from '../models/Project.js';
import UserStory from '../models/UserStory.js';
import ProjectMembership from "../models/ProjectMembership.js";

router.get('/projects/:projectId/stories', async (req, res) => {
   try{
       const {ProjectId} = req.params;
       const stories = await UserStory.find({project_id: project_id}).populate('assigned_user_id', 'name username');
       res.status(200).json(stories);
   } catch(err){
       res.status(500).json({error: 'Error: Failed to fetch user stories.', details: err.message});
   }
});

router.post('/stories', async (req, res) => {
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
           status: 'TO DO',
          assigned_user_id: assigned_user_id || null
       });
       const savedStory = await newStory.save();
       res.status(201).json(savedStory);
   } catch(err){
       res.status(500).json({error: 'Failed to create new story.', details: err.message});
   }
});

router.put('/stories/:id', async (req, res) => {
    try{
      const {project_id, title, description, priority, status, assigned_user_id} = req.body;
      const story = await UserStory.findById(req.params.id);
      if(!story){
          res.status(400).json({error: 'User Story not found'});
      }
      if(assigned_user_id !== undefined && assigned_user_id !== story.assigned_user_id?.toString()){
          const projectMembership = await ProjectMembership.findOne({
              project_id: project_id,
              user_id: assigned_user_id
          });
          if(!projectMembership){
              res.status(400).json({error: 'User is not a member of this project'});
          }
          story.assigned_user_id = assigned_user_id || null;
      }
      if(title) story.title = title;
      if(description) story.description = description;
      if(priority) story.priority = priority;
      if(status) story.status = status;
      
      const updatedStory = await story.save();
      res.status(200).json(updatedStory);
    } catch(err){
        res.status(400).json({error: 'Failed to update story.', details: err.message});
    }
});

route.delete('/stories/:id', async (req, res) => {
   try{
       const deletedStory = await UserStories.findByIdAndDelete(req.params.id);
       if(!deletedStory){
           res.status(404).json({error: 'User Story not found'});
       }
       res.status(200).json({message: 'User story deleted successfully.'});
   } catch(err){
       res.status(500).json({error: 'Failed to delete story.', details: err.message});
   }
});

export default router;