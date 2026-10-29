import React, { useState, useEffect } from 'react';

function ProjectMembers({ projects, allUsers }) {
    const [selectedproject_id, setSelectedproject_id] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedUserToAdd, setSelectedUserToAdd] = useState('');
    const [projectLeadId, setProjectLeadId] = useState(null);
    
    useEffect(() => {
        if (!selectedproject_id) {
            setMembers([]);
            setProjectLeadId(null);
            return;
        }
        
        const currentProj = projects.find(p => p._id === selectedproject_id);
        if (currentProj) {
            setProjectLeadId(currentProj.project_lead_id._id || currentProj.project_lead_id);
        }

        fetch(`/api/projects/${selectedproject_id}/members`)
            .then(res => res.json())
            .then(data => setMembers(data))
            .catch(err => console.error('Error fetching members:', err));
    }, [selectedproject_id, projects]);

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!selectedUserToAdd) return;

        try {
            const response = await fetch(`/api/projects/${selectedproject_id}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: selectedUserToAdd })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to add member');
            setMembers([...members, data]);
            setSelectedUserToAdd('');
            alert('Member added successfully!');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRemoveMember = async (user_id) => {
        if (user_id === projectLeadId) {
            alert('The current Project Lead cannot be removed from the project membership.');
            return;
        }

        try {
            const response = await fetch(`/api/projects/${selectedproject_id}/members/${user_id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to remove member');
            setMembers(members.filter(m => m.user_id._id !== user_id));
            alert('Member removed successfully.');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div>
            <h2>Manage Project Memberships</h2>

            {/* Select Project */}
            <div>
                <label>Select Project:</label>
                <select value={selectedproject_id} onChange={(e) => setSelectedproject_id(e.target.value)}>
                    <option value="">-- Choose a Project --</option>
                    {projects.map(proj => (
                        <option key={proj._id} value={proj._id}>{proj.name}</option>
                    ))}
                </select>
            </div>

            {selectedproject_id && (
                <div>
                    <h3>Current Members</h3>
                    <ul>
                        {members.map(member => {
                            const user = member.user_id;
                            if(!user) return null;
                            const isLead = user._id === projectLeadId;

                            return (
                                <li key={member._id}>
                                    {user.f_name} {user.l_name} ({user.username}) {isLead && <strong>[Project Lead]</strong>}
                                    {!isLead && (
                                        <button onClick={() => handleRemoveMember(user._id)}>Remove</button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    {/* Add Member Form */}
                    <form onSubmit={handleAddMember}>
                        <h4>Add New Member</h4>
                        <select value={selectedUserToAdd} onChange={(e) => setSelectedUserToAdd(e.target.value)} required>
                            <option value="">-- Select a User to Add --</option>
                            {allUsers.map(u => (
                                <option key={u._id} value={u._id}>
                                    {u.f_name} {u.l_name} ({u.username})
                                </option>
                            ))}
                        </select>
                        <button type="submit">Add to Project</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ProjectMembers;