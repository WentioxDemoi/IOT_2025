import React, { useState, useEffect } from 'react';
import './History.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import {BACKEND} from "../Host";

const History = ({ token, mac }) => {
    const [historyData, setHistoryData] = useState([]);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('minute');

    // Fetch historical data based on time range
    const fetchHistory = async () => {
        try {
            const response = await fetch(`${BACKEND}/api/sensor-history/${mac}?timeRange=${timeRange}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setHistoryData(data);
        } catch (err) {
            setError('Failed to fetch history data');
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [timeRange]);

    // Format the data for the graph
    const graphData = {
        labels: historyData.map(entry => new Date(entry.createdAt).toLocaleTimeString()),
        datasets: [
            {
                label: 'Temperature (°C)',
                data: historyData.map(entry => entry.temperature),
                fill: false,
                borderColor: '#f88',
            },
            {
                label: 'Humidity (%)',
                data: historyData.map(entry => entry.humidity),
                fill: false,
                borderColor: '#00bfff',
            },
        ],
    };

    return (
        <div className="history">
            <h2>Sensor Data History</h2>

            <div className="button-group">
                <button className={`history-button ${timeRange === 'minute' ? 'active' : ''}`} onClick={() => setTimeRange('minute')}>Minute</button>
                <button className={`history-button ${timeRange === 'hour' ? 'active' : ''}`} onClick={() => setTimeRange('hour')}>Hour</button>
                <button className={`history-button ${timeRange === 'day' ? 'active' : ''}`} onClick={() => setTimeRange('day')}>Day</button>
                <button className={`history-button ${timeRange === 'week' ? 'active' : ''}`} onClick={() => setTimeRange('week')}>Week</button>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="graph">
                <Line data={graphData} />
            </div>
        </div>
    );
};

export default History;
