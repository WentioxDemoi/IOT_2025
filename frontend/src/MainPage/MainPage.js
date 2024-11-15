import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../App.css';
import LightControl from '../LightControl/LightControl';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import History from '../History/History';
import { BACKEND } from "../Host";
import AlarmControl from '../AlarmControl/AlarmControl'; // Import AlarmControl

const MainPage = () => {
    const { macAddress } = useParams();
    const [sensorData, setSensorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [username, setUsername] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (isAuthenticated) {
            fetchSensorData();
            const intervalId = setInterval(() => {
                fetchSensorData();
            }, 60000);
            return () => clearInterval(intervalId);
        }
    }, [isAuthenticated]);

    const fetchSensorData = () => {
        setLoading(true);
        console.log("macAddress: " + macAddress);
        fetch(`${BACKEND}/api/sensor-data/${macAddress}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 401) {
                        console.log("Handle logout on unauthorized access");
                    }
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                setSensorData(data[0]);
                setLoading(false);
            })
            .catch((error) => {
                setError('Failed to fetch sensor data');
                setLoading(false);
            });
    };

    const handleDelete = () => {
        fetch(BACKEND + '/api/device', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ macAddress: macAddress }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Device deleted successfully:", data);
            })
            .catch((error) => {
                console.error('Failed to delete device:', error);
            });
    };


    return (
        <>
            <header className="app-header">
                <h1>Control your device with no stress !</h1>
                <p>MAC Address: {macAddress}</p>
                <button onClick={handleDelete} className="logout-button">
                    Delete
                </button>
            </header>

            <div className="main-container">
                <div className="left-side">
                    <div className="gauges">
                        <div className="gauge">
                            <h2>Temperature</h2>
                            {sensorData ? (
                                <CircularProgressbar
                                    value={sensorData.temperature}
                                    text={`${sensorData.temperature}°C`}
                                    maxValue={50}
                                    styles={buildStyles({
                                        textColor: '#f88',
                                        pathColor: '#f88',
                                        trailColor: '#d6d6d6',
                                        strokeLinecap: 'round',
                                    })}
                                />
                            ) : (
                                <LoadingSpinner />
                            )}
                        </div>
                        <div className="gauge">
                            <h2>Humidity</h2>
                            {sensorData ? (
                                <CircularProgressbar
                                    value={sensorData.humidity}
                                    text={`${sensorData.humidity}%`}
                                    maxValue={100}
                                    styles={buildStyles({
                                        textColor: '#00bfff',
                                        pathColor: '#00bfff',
                                        trailColor: '#d6d6d6',
                                        strokeLinecap: 'round',
                                    })}
                                />
                            ) : (
                                <LoadingSpinner />
                            )}
                        </div>
                    </div>

                    <div className="light-control-section">
                        <h1>Light Control</h1>
                        <LightControl mac={macAddress} />
                    </div>

                    <div className="alarm-control-section">
                        <h1>Alarm Control</h1>
                        <AlarmControl mac={macAddress} />
                    </div>
                </div>

                <div className="center-graph">
                    <History token={localStorage.getItem('token')} mac={macAddress} />
                </div>
            </div>

            <footer>
                <p>© 2024 Halouf IoT</p>
            </footer>
        </>
    );
}

export default MainPage;
