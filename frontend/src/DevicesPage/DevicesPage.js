import React, { useState, useEffect } from 'react';
import './DevicesPage.css';
import { BACKEND } from "../Host";
import Main from "../MainPage/MainPage"
import { useNavigate } from 'react-router-dom';

const DevicesPage = ({ handleLogout }) => {
    const savedUsername = localStorage.getItem('username');
    const savedToken = localStorage.getItem('token');
    const [devices, setDevices] = useState([]);
    const [devices_available, setDevicesAv] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleDeviceAvClick = async (device) => {
        if (device.username === null) {
            try {
                const response = await fetch(BACKEND + '/api/registerdevice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${savedToken}`,
                    },
                    body: JSON.stringify({ macAddress: device.macAddress })
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de l\'enregistrement de l\'appareil');
                }

                setDevicesAv((prevDevices) =>
                    prevDevices.filter((d) => d.macAddress !== device.macAddress)
                );
                console.log("Appareil enregistré et supprimé de la liste");
            } catch (error) {
                console.error("Erreur lors de l'enregistrement de l'appareil:", error);
                setError("Impossible d'enregistrer l'appareil");
            }
        } else {
            console.log("L'appareil est déjà associé à un utilisateur :", device.username);
        }
    };

    const handleDeviceClick = async (device) => {
        navigate(`/main/${device.macAddress}`);
    };

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await fetch(BACKEND + '/api/availabledevices', {
                    headers: {
                        'Authorization': `Bearer ${savedToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des appareils');
                }
                const data = await response.json();
                console.log(data);
                setDevicesAv(data);
            } catch (err) {
                setError('Impossible de récupérer les appareils');
            }
        };
        fetchDevices();
    }, [savedUsername]);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await fetch(BACKEND + '/api/mydevices', {
                    headers: {
                        'Authorization': `Bearer ${savedToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des appareils');
                }
                const data = await response.json();
                console.log(data);
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
                    <button className="add-device-button">
                        Add device
                    </button>
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
                            onClick={() => handleDeviceClick(device)}
                        >
                            <h3>{device.macAddress}</h3>
                        </div>
                    ))
                ) : (
                    <p>No devices available</p>
                )}
            </div>

            <h2 className="devices-title">Devices available : </h2>
            <div className="scroll-view">
                {error && <p className="error-message">{error}</p>}

               
                {devices_available.length > 0 ? (
                    devices_available.map((device, index) => (
                        <div
                            key={index}
                            className="scroll-item"
                            onClick={() => handleDeviceAvClick(device)}
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
