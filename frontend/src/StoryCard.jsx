import React from 'react';

export default function StoryCard({ story, onEdit, onDelete }) {
    const assigneeName = story.assigned_user_id && typeof story.assigned_user_id === 'object'
        ? `${story.assigned_user_id.f_name || ''} ${story.assigned_user_id.l_name || ''}`.trim() || 'Assigned'
    : 'Unassigned';
    return (
        <div className="story-card card">
            <div className="story-header">
                <h3>{story.title}</h3>
                <span className={`badge priority-${story.priority.toLowerCase()}`}>{story.priority}</span>
            </div>
            <p className="story-desc">{story.description}</p>
            <div className="story-footer">
                <span className={`status-${story.status.toLowerCase().replace(' ', '-')}`}>Status: {story.status}</span>
                <span>Assignee: {assigneeName}</span>
                <div className="actions">
                    <button onClick={onEdit}>Edit</button>
                    <button onClick={() => onDelete(story._id)} className="danger">Delete</button>
                </div>
            </div>
        </div>
    );
}