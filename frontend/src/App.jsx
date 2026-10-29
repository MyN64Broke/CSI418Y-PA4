import React, { useState, useEffect } from 'react';
import Signup from './Signup';
import Login from './Login';
import CreateProject from "./CreateProject";
import ProjectList from './ProjectList';
import ProjectManager from './ProjectManager';
import './App.css';

export default function App() {
    const [user, setUser] = useState(null);
    const [authView, setAuthView] = useState('login');
    
    const [currentView, setCurrentView] = useState('projects');
    const [allUsers, setAllUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    
    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setAllUsers(data))
            .catch(err => console.error('Error fetching users:', err));
        
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(err => console.error('Error fetching projects:', err));
    }, [user]);

    const handleProjectCreated = (newProject) => {
        setProjects([...projects, newProject]);
        setCurrentView('projects');
    };

    const handleSignOut = () => {
        setUser(null);
        setCurrentView('projects');
        setAllUsers([]);
        setProjects([]);
    };

    if (!user) {
        return (
            <div className="App" style={{ textAlign: 'center', marginTop: '40px' }}>
                <h1>Software Engineering Project Manager</h1>
                <div style={{ marginBottom: '20px' }}>
                    <button
                        onClick={() => setAuthView('login')}
                        style={{ fontWeight: authView === 'login' ? 'bold' : 'normal', marginRight: '10px' }}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setAuthView('signup')}
                        style={{ fontWeight: authView === 'signup' ? 'bold' : 'normal' }}
                    >
                        Sign Up
                    </button>
                </div>

                {authView === 'login' ? (
                    <Login onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />
                ) : (
                    <Signup onSignupSuccess={() => setAuthView('login')} />
                )}
            </div>
        );
    }

    return (
        <div className="App">
            <header className="app-header">
                <h1>Software Engineering Project Manager (PA3)</h1>

                {/* Navigation and Sign Out Container */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
                    <nav className="app-nav">
                        <button
                            className={currentView === 'projects' ? 'active' : ''}
                            onClick={() => setCurrentView('projects')}
                        >
                            View Projects
                        </button>
                        <button
                            className={currentView === 'create' ? 'active' : ''}
                            onClick={() => setCurrentView('create')}
                        >
                            Create Project
                        </button>
                        <button
                            className={currentView === 'members' ? 'active' : ''}
                            onClick={() => setCurrentView('members')}
                        >
                            Manage Memberships
                        </button>
                    </nav>

                    {/* Sign Out Button */}
                    <button
                        onClick={handleSignOut}
                        style={{
                            backgroundColor: '#ff4d4d',
                            color: 'white',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="app-content">
                {currentView === 'projects' && <ProjectList projects={projects} />}
                {currentView === 'create' && (
                    <CreateProject users={allUsers} onProjectCreated={handleProjectCreated} />
                )}
                {currentView === 'members' && (
                    <ProjectManager projects={projects} allUsers={allUsers} />
                )}
            </main>
        </div>
    );
}