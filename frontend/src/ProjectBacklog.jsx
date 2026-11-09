import React, {useState, useEffect} from 'react';
import StoryCard from './StoryCard';
import StoryForm from './StoryForm';

export default function ProjectBacklog({currentProject}) {
    const[stories, setStories] = useState([]);
    const[loading, setLoading] = useState(false);
    const[editingStory, setEditingStory] = useState(null);
    const[showCreateForm, setShowCreateForm] = useState(false);

    if (!currentProject) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3>No Project Selected</h3>
                <p>Please go back to "View Projects" and click "View Backlog" on a specific project.</p>
            </div>
        );
    }
    
    useEffect(()=>{
        if(!currentProject){
            setStories([]);
            return;
        }
        
        setEditingStory(null);
        setShowCreateForm(false);
        
        async function fetchStories(){
            setLoading(true);
            try{
                const res = await fetch(`/api/projects/${currentProject._id}/stories`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setStories(data);
                } else {
                    console.error("API did not return an array:", data);
                    setStories([]);
                }
            }catch(err){
                console.error('Failed to fetch stories', err);
                setStories([]);
            }finally{
                setLoading(false);
            }
        }
        fetchStories();
    }, [currentProject]);

    const handleDeleteStory = async (storyId) => {
        try {
            const response = await fetch(`/api/projects/${currentProject._id}/stories/${storyId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setStories(prevStories => prevStories.filter(story => story._id !== storyId));
            } else {
                console.error('Failed to delete the story from the database');
            }
        } catch (err) {
            console.error('Error deleting story:', err);
        }
    };

    if (!currentProject) return <p>Please select a project to view its backlog.</p>;
    if (loading) return <p>Loading backlog...</p>;

    const storyCount = Array.isArray(stories) ? stories.length : 0;

    return (
        <div className="project-backlog">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>{currentProject.name} - Backlog</h2>
                
                <button
                    onClick={() => { setShowCreateForm(true); setEditingStory(null); }}
                    style={{
                        backgroundColor: '#2ecc71',
                        color: 'white',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    + Add User Story
                </button>
            </div>
            
            {showCreateForm && (
                <StoryForm
                    project_id={currentProject._id}
                    onClose={() => setShowCreateForm(false)}
                    onSave={(newStory) => {
                        setStories([...stories, newStory]);
                        setShowCreateForm(false);
                    }}
                />
            )}
            
            {editingStory && (
                <StoryForm
                    project_id={currentProject._id}
                    story={editingStory}
                    onClose={() => setEditingStory(null)}
                    onSave={(updatedStory) => {
                        setStories(stories.map(s => s._id === updatedStory._id ? updatedStory : s));
                        setEditingStory(null);
                    }}
                />
            )}
            
            {stories?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '8px', border: '1px solid #e1e8ed' }}>
                    <p style={{ color: '#666', marginBottom: '15px' }}>This project has no user stories yet.</p>
                    <button
                        onClick={() => { setShowCreateForm(true); setEditingStory(null); }}
                        style={{
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Create your first user story
                    </button>
                </div>
            ) : (
                <div className="story-list">
                    {Array.isArray(stories) && stories.map(story => (
                        <StoryCard
                            key={story._id}
                            story={story}
                            onEdit={() => setEditingStory(story)}
                            onDelete={() => handleDeleteStory(story._id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}