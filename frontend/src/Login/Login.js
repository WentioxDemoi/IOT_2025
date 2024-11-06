import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate
import './Login.css';
import { BACKEND } from "../Host";

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook pour rediriger

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${BACKEND}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            onLogin(username);

            // Redirection vers la page "Fetching Devices"
            navigate('/devices'); // Redirige vers /devices
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-page">
            <header className="login-header">
                <h1>Halouf IoT</h1>
            </header>
            <div className="login-container">
                <div className="login-content">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <p className="error">{error}</p>}
                        <button type="submit" className="login-button">Login</button>
                    </form>
                    <p>Don't have an account? <Link to="/register">Create one</Link></p>
                </div>
            </div>
            <footer className="login-footer">
                <p>© 2024 Halouf IoT</p>
            </footer>
        </div>
    );
};

export default Login;
