import React, { useState, useEffect } from 'react';

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetch('/api/projects')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch projects.');
                }
                return res.json();
            })
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading projects...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Project List</h2>

            {projects.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    marginTop: '20px'
                }}>
                    <h3>No Projects Yet</h3>
                    <p style={{ color: '#666' }}>Get started by creating your first software engineering project!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {projects.map((project) => {
                        const lead = project.project_lead_id;
                        const leadName = lead ? `${lead.f_name} ${lead.l_name} (${lead.username})` : 'Unknown Lead';

                        return (
                            <div
                                key={project._id}
                                style={{
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    backgroundColor: '#f9f9f9'
                                }}
                            >
                                <h3>{project.name}</h3>
                                <p><strong>Description:</strong> {project.description}</p>
                                <p>
                                    <strong>Status:</strong>{' '}
                                    <span style={{
                                        padding: '3px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: project.status === 'Active' ? '#d4edda' : project.status === 'Completed' ? '#cce5ff' : '#fff3cd'
                                    }}>
                    {project.status}
                  </span>
                                </p>
                                <p><strong>Project Lead:</strong> {leadName}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ProjectList;