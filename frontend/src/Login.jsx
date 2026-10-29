import { useState } from 'react';
import React from 'react';

export default function Login({ onLoginSuccess }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (!res.ok) {
                setIsError(true);
                setMessage(data.message);
            } else {
                setIsError(false);
                setMessage(data.message);

                if (onLoginSuccess) {
                    setTimeout(() => {
                        onLoginSuccess(formData);
                    }, 800);
                }
            }
        } catch (err) {
            setIsError(true);
            setMessage('Failed to connect to the server.');
        }
    };

    return (
        <div className="card">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                <button type="submit">Log In</button>
            </form>
            {message && <p className={isError ? 'error-msg' : 'success-msg'}>{message}</p>}
        </div>
    );
}