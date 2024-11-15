import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import './LightControl.css';
import { BACKEND } from "../Host";

const LightControl = ({ mac }) => {
    const [macAddress, setMacAddress] = useState(mac);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lightStatus, setLightStatus] = useState('Off');

    const handleLightAction = async () => {
        setLoading(true);
        setError(null);
        const action = lightStatus === 'On' ? 'off' : 'on';

        try {
            if (macAddress !== undefined) {
                const response = await fetch(BACKEND + `/api/light/${macAddress}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({action}),
                });
                if (response.ok) {
                    setLightStatus(action === 'on' ? 'On' : 'Off');
                } else {
                    throw new Error('Request failed');
                }
            }
        } catch (err) {
            setError('Failed to control the light');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="light-control">
            <button
                onClick={handleLightAction}
                disabled={loading}
                className={`light-button ${lightStatus === 'On' ? 'on' : 'off'}`}>
                <FontAwesomeIcon
                    icon={lightStatus === 'On' ? faBolt : faBatteryEmpty}
                    size="2x"
                    color="#fff"
                />
                <span>{loading ? 'Processing...' : `Turn Light ${lightStatus === 'On' ? 'Off' : 'On'}`}</span>
            </button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default LightControl;