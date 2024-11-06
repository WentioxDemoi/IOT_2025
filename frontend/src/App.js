import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './App.css';
import { LightControl } from './LightControl/LightControl';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import Login from './Login/Login';
import CreateAccount from './Login/CreateAccount';
import History from './History/History';
import { BACKEND } from "./Host"; 
import DevicesPage from './DevicesPage/DevicesPage'; // Import du composant pour les appareils
import MainPage from './MainPage/MainPage'; // Import du composant pour les appareils


function App() {
    const [sensorData, setSensorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const token = localStorage.getItem('token'); // Récupération du token dans le localStorage


    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUsername = localStorage.getItem('username');
        if (savedToken) {
            setIsAuthenticated(true);
            setUsername(savedUsername);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchSensorData();
            const intervalId = setInterval(() => {
                fetchSensorData();
            }, 60000); // Actualisation toutes les minutes
            return () => clearInterval(intervalId);
        }
    }, [isAuthenticated]);

    const fetchSensorData = () => {
        setLoading(true);
        fetch(BACKEND + '/api/sensor-data', {
            headers: {
                'Authorization': `Bearer ${token}`, // Envoie le token pour l'authentification
            },
        })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 401) {
                    handleLogout(); // Handle logout on unauthorized access
                }
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            setSensorData(data[0]); // Assumant que data est un tableau
            setLoading(false);
        })
        .catch((error) => {
            setError('Failed to fetch sensor data');
            setLoading(false);
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        // navigate('/login');
    };

    return (
        <Router>
            <AppRoutes 
                isAuthenticated={isAuthenticated} 
                setIsAuthenticated={setIsAuthenticated} 
                username={username} 
                setUsername={setUsername} 
                sensorData={sensorData}
                handleLogout={handleLogout} // Pass handleLogout here
            />
        </Router>
    );
}

function AppRoutes({ isAuthenticated, setIsAuthenticated, username, setUsername, sensorData, handleLogout }) {
    const navigate = useNavigate();
  
    const handleLogin = (username) => {
      setIsAuthenticated(true);
      setUsername(username);
      localStorage.setItem('username', username);
      //navigate('/devices'); // Redirection après login réussie
    };
  
    const handleAccountCreated = () => {
      setIsAuthenticated(false); // Redirection après la création de compte
      navigate('/login'); // Retour à la page login
    };
  
    return (
        <Routes>
  {!isAuthenticated ? (
    <>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<CreateAccount onAccountCreated={handleAccountCreated} />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </>
  ) : (
    <>
      <Route path="/devices" element={<DevicesPage handleLogout={handleLogout} />} />
      <Route path="/main/:macAddress" element={<MainPage />} />
      <Route path="*" element={<Navigate to="/devices" />} />
    </>
  )}
</Routes>

      
    );
  }
  

export default App;
