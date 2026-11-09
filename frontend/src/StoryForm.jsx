import React, {useState, useEffect} from 'react';

export default function StoryForm({project_id, story, onClose, onSave}){
    const[title,setTitle] = useState(story ? story.title : '');
    const[description,setDescription] = useState(story ? story.description : '');
    const[priority, setPriority] = useState(story ? story.priority : 'Medium');
    const[status, setStatus] = useState(story ? story.status : 'To-Do');
    const[assignedUserId, setAssignedUserId] = useState(story?.assigned_user_id?._id || story?.assigned_user_id || '');
    
    const[projectMembership, setProjectMembership] = useState([]);
    
    useEffect(()=>{
        async function fetchMembers(){
            try{
                const res = await fetch(`/api/projects/${project_id}/members`);
                const data = await res.json();
                setProjectMembership(data);
            }catch(err){
                console.error('Failed to fetch project members', err);
            }
        }
        fetchMembers();
    }, [project_id]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            project_id: project_id,
            title: title,
            description: description,
            priority: priority,
            status: status,
            assigned_user_id: assignedUserId === '' ? null : assignedUserId
        };

        const url = story ? `/api/projects/${project_id}/stories/${story._id}` : `/api/projects/${project_id}/stories`;
        const method = story ? 'PUT' : 'POST';
        
        try{
            const res = await fetch(url, {
                method,
                headers: {'Content-Type': 'application/json'},
                body : JSON.stringify(payload),
            });
            if(res.ok){
                const savedStory  = await res.json();
                onSave(savedStory);
            }
        }catch(err){
            console.error('Failed to save story', err);
        }
    }
    
    return (
        <div className="modal-backdrop">
            <form onSubmit={handleSubmit} className="story-form card">
                <h3>{story ? 'Edit User Story' : 'Create User Story'}</h3>

                <label>Title:</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />

                <label>Description:</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required />

                <label>Priority:</label>
                <select value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>

                <label>Status:</label>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="To-Do">To-Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>

                <label>Assignee:</label>
                <select value={assignedUserId} onChange={e => setAssignedUserId(e.target.value)}>
                    <option value="">Unassigned</option>
                    {projectMembership.map(member => {
                        const u = member.user_id || member;

                        const displayName = (u.f_name || u.l_name)
                            ? `${u.f_name || ''} ${u.l_name || ''} ${u.username ? `(${u.username})` : ''}`.trim()
                            : 'Unnamed User';
                        
                        const userId = u._id || member._id;

                        return (
                            <option key={member._id} value={userId}>
                                {displayName}
                            </option>
                        );
                    })}
                </select>

                <div className="form-actions">
                    <button type="submit">Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
}