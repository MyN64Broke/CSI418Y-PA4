import React, { useState } from 'react';

function CreateProject({ users, onProjectCreated }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'Planning',
        project_lead_id: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to create project');

            const data = await response.json();
            onProjectCreated(data);
            alert('Project created successfully!');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Project</h2>

            <div>
                <label>Project Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div>
                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required />
            </div>

            <div>
                <label>Status:</label>
                <select name="status" value={formData.status} onChange={handleChange} required>
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            <div>
                <label>Project Lead:</label>
                <select name="project_lead_id" value={formData.project_lead_id} onChange={handleChange} required>
                    <option value="">-- Select a User --</option>
                    {users && users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.f_name} {user.l_name} ({user.username})
                        </option>
                    ))}
                </select>
            </div>

            <button type="submit">Create Project</button>
        </form>
    );
}

export default CreateProject;