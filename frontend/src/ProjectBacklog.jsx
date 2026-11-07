import React, {useState, useEffect} from 'react';
import StoryCard from './StoryCard';
import StoryForm from './StoryForm';

export default function ProjectBacklog({currentProject}) {
    const{stories, setStories} = useState([]);
    const{loading, setLoading} = useState(false);
    const{editingStory, setEditingStory} = useState(null);
    const{showCreateForm, setShowCreateForm} = useState(false);
    
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
                const res = await fetch(`/api/projects/${currentProject.id}/stories`);
                const data = await res.json();
                setStories(data);
            }catch(err){
                console.error('Failed to fetch stories', err);
            }finally{
                setLoading(false);
            }
        }
        fetchStories();
    }, [currentProject]);

    if (!currentProject) return <p>Please select a project to view its backlog.</p>;
    if (loading) return <p>Loading backlog...</p>;

    return (
        <div className="project-backlog">
            <h2>{currentProject.name} - Backlog</h2>
            <button onClick={() => { setShowCreateForm(true); setEditingStory(null); }}>
                + Add User Story
            </button>

            {showCreateForm && (
                <StoryForm
                    projectId={currentProject._id}
                    onClose={() => setShowCreateForm(false)}
                    onSave={(newStory) => {
                        setStories([...stories, newStory]);
                        setShowCreateForm(false);
                    }}
                />
            )}

            {editingStory && (
                <StoryForm
                    projectId={currentProject._id}
                    story={editingStory}
                    onClose={() => setEditingStory(null)}
                    onSave={(updatedStory) => {
                        setStories(stories.map(s => s._id === updatedStory._id ? updatedStory : s));
                        setEditingStory(null);
                    }}
                />
            )}

            {stories.length === 0 ? (
                <p>This project has no stories yet.</p>
            ) : (
                <div className="story-list">
                    {stories.map(story => (
                        <StoryCard
                            key={story._id}
                            story={story}
                            onEdit={() => setEditingStory(story)}
                            onDelete={async (id) => {
                                if (window.confirm("Are you sure you want to delete this story?")) {
                                    await fetch(`/api/stories/${id}`, { method: 'DELETE' });
                                    setStories(stories.filter(s => s._id !== id));
                                }
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}