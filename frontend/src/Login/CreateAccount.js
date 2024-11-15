import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import {BACKEND} from "../Host";

const CreateAccount = ({ onAccountCreated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mail, setMail] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${BACKEND}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, mail, password }),
            });

            if (!response.ok) {
                throw new Error('Account creation failed');
            }

            onAccountCreated(); // Trigger callback after account creation
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-page">
            <header className="login-header">
                <h1>Create a New Account</h1>
            </header>

            <div className="login-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <h2>Sign Up</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
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
                    <button type="submit" className="login-button">Create Account</button>
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>

            <footer className="login-footer">
                <p>© 2024 Halouf IoT</p>
            </footer>
        </div>
    );
};

export default CreateAccount;
