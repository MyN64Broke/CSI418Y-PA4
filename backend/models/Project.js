import mongoose, {Mongoose} from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["Planning", "Active", "Completed"],
        default: "Planning"
    },
    project_lead_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Project = mongoose.model('Project', projectSchema);
export default Project;