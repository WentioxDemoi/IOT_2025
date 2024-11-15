import React, { useState } from 'react';
import './AlarmControl.css'; // Import the updated CSS file
import { BACKEND } from "../Host";

const AlarmControl = ({ mac }) => {
    const [humidityMax, setHumidityMax] = useState(50);
    const [alarmStatus, setAlarmStatus] = useState('Off');
    const [error, setError] = useState(null);

    const handleAlarmAction = async (action, value = humidityMax) => {
        try {
            const response = await fetch(`${BACKEND}/api/alarm/${mac}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ action, value} ),
            });
            if (response.ok) {
                if (action === 'alarm') setAlarmStatus(value === 'on' ? 'On' : 'Off');
            } else {
                throw new Error('Request failed');
            }
        } catch (err) {
            setError('Failed to control the alarm');
        }
    };

    const click = () => {
        const alarm = { alarm: {} };
        alarm.alarm.light = 'on';
        console.log(alarm);
    }

    return (
        <div className="alarm-control">
            <h3>Alarm Control</h3>
            <label>
                Set Max Humidity for Alarm:
                <input
                    type="number"
                    value={humidityMax}
                    onChange={(e) => setHumidityMax(e.target.value)}
                />
            </label>
            <div className="buttons-container">
                <button onClick={() => handleAlarmAction('alarm', alarmStatus === 'On' ? 'off' : 'on')}
                        className="start-stop-button">
                    {alarmStatus === 'On' ? 'Stop Alarm' : 'Start Alarm'}
                </button>
                <button onClick={() => handleAlarmAction('humidity')} className="save-humidity-button">
                    Save Humidity
                </button>
                <button onClick={() => handleAlarmAction('light')} className="stop-signal-button">
                    Stop Light Signal
                </button>
            </div>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default AlarmControl;
