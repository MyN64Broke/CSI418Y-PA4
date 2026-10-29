import { useState } from 'react';
import React from 'react';

export default function Signup() {
    const [formData, setFormData] = useState({
        f_name: '',
        l_name: '',
        username: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const res = await fetch('http://localhost:5000/api/signup', {
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
                setFormData({ f_name: '', l_name: '', username: '', password: '' });
            }
        } catch (err) {
            setIsError(true);
            setMessage('Failed to connect to the server.');
        }
    };

    return (
        <div className="card">
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input name="f_name" placeholder="First Name" value={formData.f_name} onChange={handleChange} />
                <input name="l_name" placeholder="Last Name" value={formData.l_name} onChange={handleChange} />
                <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                <button type="submit">Sign Up</button>
            </form>
            {message && <p className={isError ? 'error-msg' : 'success-msg'}>{message}</p>}
        </div>
    );
}