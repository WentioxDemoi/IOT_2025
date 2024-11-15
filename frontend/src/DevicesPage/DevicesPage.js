import React, { useState, useEffect } from 'react';
import './DevicesPage.css';
import { BACKEND } from "../Host";
import DeviceDetails from './DeviceDetails';
import {useNavigate} from "react-router-dom";

const DevicesPage = ({ handleLogout }) => {
    const savedUsername = localStorage.getItem('username');
    const savedToken = localStorage.getItem('token');
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await fetch(BACKEND + '/api/device/me', {
                    headers: {
                        'Authorization': `Bearer ${savedToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des appareils');
                }
                const data = await response.json();
                setDevices(data);
            } catch (err) {
                setError('Impossible de récupérer les appareils');
            }
        };
        fetchDevices();
    }, [savedUsername]);



    return (
        <>
            <header className="app-header">
                <h1>Welcome, {savedUsername}!</h1>
                <div className="header-buttons">
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </header>

            <h2 className="devices-title">My devices : </h2>

            <div className="scroll-view">
                {error && <p className="error-message">{error}</p>}

                {devices.length > 0 ? (
                    devices.map((device, index) => (
                        <div
                            key={index}
                            className="scroll-item"
                            onClick={() => {navigate(`/device/${device.macAddress}`)}}
                        >
                            <h3>{device.macAddress}</h3>
                        </div>
                    ))
                ) : (
                    <p>No devices available</p>
                )}
            </div>

        </>
    );
};

export default DevicesPage;
