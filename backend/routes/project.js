import express from 'express';
const router = express.Router();
import Project from '../models/Project.js';
import ProjectMembership from '../models/ProjectMembership.js';
import User from '../models/User.js';
router.post('/', async (req, res) => {
    try {
        const { name, description, status, project_lead_id } = req.body;
        if (!name || !description || !status || !project_lead_id) {
            return res.status(400).json({ message: 'One or more required project fields are empty.' });
        }
        const leadUser = await User.findById(project_lead_id);
        if (!leadUser) {
            return res.status(404).json({ message: 'The selected Project Lead does not exist.' });
        }
        const newProject = new Project({
            name,
            description,
            status,
            project_lead_id
        });
        const savedProject = await newProject.save();
        const initialMembership = new ProjectMembership({
            project_id: savedProject._id,
            user_id: project_lead_id
        });
        await initialMembership.save();
        const populatedProject = await Project.findById(savedProject._id).populate('project_lead_id', 'f_name l_name username');
        res.status(201).json(populatedProject);

    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ message: 'A database or server error occurs.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('project_lead_id', 'f_name l_name username');
        res.status(200).json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ message: 'A database or server error occurs.' });
    }
});

router.get('/:id/members', async (req, res) => {
    try {
        const project_id = req.params.id;
        const project = await Project.findById(project_id);
        if (!project) {
            return res.status(404).json({ message: 'Requested project does not exist.' });
        }
        const memberships = await ProjectMembership.find({ project_id: project_id }).populate('user_id', 'f_name l_name username');
        res.status(200).json(memberships);
    } catch (err) {
        console.error('Error fetching project members:', err);
        res.status(500).json({ message: 'A database or server error occurs.' });
    }
});

router.post('/:id/members', async (req, res) => {
    try {
        const project_id = req.params.id;
        const { user_id } = req.body;
        
        const project = await Project.findById(project_id);
        if (!project) {
            return res.status(404).json({ message: 'Requested project does not exist.' });
        }
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'Requested user does not exist.' });
        }
        const existingMembership = await ProjectMembership.findOne({ project_id: project_id, user_id: user_id });
        if (existingMembership) {
            return res.status(400).json({ message: 'User is already a member of the selected project.' });
        }
        const newMembership = new ProjectMembership({
            project_id: project_id,
            user_id: user_id
        });
        const savedMembership = await newMembership.save();
        const populatedMembership = await ProjectMembership.findById(savedMembership._id).populate('user_id', 'f_name l_name username');
        res.status(201).json(populatedMembership);

    } catch (err) {
        console.error('Error adding member:', err);
        res.status(500).json({ message: 'A database or server error occured.' });
    }
});

router.delete('/:project_id/members/:user_id', async (req, res) => {
    try {
        const { project_id, user_id } = req.params;
        const project = await Project.findById(project_id);
        if (!project) {
            return res.status(404).json({ message: 'The requested project does not exist.' });
        }
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'The requested user does not exist.' });
        }
        if (project.project_lead_id.toString() === user_id) {
            return res.status(400).json({ message: 'Current Project Lead cannot be removed.' });
        }
        const deletedMembership = await ProjectMembership.findOneAndDelete({
            project_id: project_id,
            user_id: user_id
        });
        if (!deletedMembership) {
            return res.status(404).json({ message: 'Membership record not found.' });
        }
        res.status(200).json({ message: 'Member successfully removed from project.' });
    } catch (err) {
        console.error('Error removing member:', err);
        res.status(500).json({ message: 'A database or server error occured.' });
    }
});

export default router;