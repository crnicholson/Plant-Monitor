'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SensorList from '../../components/SensorList';

const DashboardPage = () => {
    const [sensors, setSensors] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchSensors = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.01:5000/sensors', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setSensors(data.sensors);
            } else {
                router.push('/login');
            }
        };

        fetchSensors();
    }, [router]);

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <SensorList sensors={sensors} />
        </div>
    );
};

export default DashboardPage;
