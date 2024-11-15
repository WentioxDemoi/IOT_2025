import React, { useState } from 'react';
import LightControl from '../LightControl/LightControl';
import AlarmControl from '../AlarmControl/AlarmControl';
// import './DeviceDetails.css';

const DeviceDetails = ({ device, token }) => {
    return (
        <div className="device-details">
            <h2>Device Details</h2>
            <p>MAC Address: {device.macAddress}</p>

            <LightControl mac={device.macAddress} />
            <AlarmControl mac={device.macAddress} token={token} />
        </div>
    );
};

export default DeviceDetails;
