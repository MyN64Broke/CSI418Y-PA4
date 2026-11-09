import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    project_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
    title: {type: String, required:true},
    description: {type: String, required:true},
    priority:{
        type: String,
        required:true,
        enum: ["High", "Medium", "Low"],
        default: "High"
    },
    status: {
        type: String,
        required:true,
        enum: ["To-Do", "In Progress", "Done"],
        default: "To-Do"
    },
    assigned_user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null}
})
const UserStory = mongoose.model('UserStory', ProjectSchema);
export default UserStory;