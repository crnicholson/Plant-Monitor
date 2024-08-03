'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import SensorDetail from '../../../components/SensorDetail';

const SensorDetailPage = () => {
    const [sensorData, setSensorData] = useState(null);
    const { name } = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchSensorData = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.01:5000/sensor/${name}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setSensorData(data);
            } else {
                router.push('/login');
            }
        };

        fetchSensorData();
    }, [name, router]);

    return (
        <div className="sensor-detail-container">
            <h1>Sensor: {name}</h1>
            {sensorData ? <SensorDetail data={sensorData} /> : <p>Loading...</p>}
        </div>
    );
};

export default SensorDetailPage;
