import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useUser } from "@auth0/nextjs-auth0/client";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Chart({ id }) {
    const { user, error, isLoading } = useUser();
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        async function getChartData() {
            try {
                console.log("Fetching data...");
                const response = await fetch('http://127.0.0.1:5000/get-chart-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "owner": user.name, "station": id }),
                });
                if (response.ok) {
                    const data = await response.json();
                    const soil = data["soil"];
                    const humidity = data["humidity"];
                    const temp = data["temp"];
                    const time = data["time"];

                    const chartData = {
                        labels: time,
                        datasets: [
                            {
                                label: 'Soil humidity (%)',
                                data: soil,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                fill: false,
                            },
                            {
                                label: 'Air humidity (RH%)',
                                data: humidity,
                                borderColor: 'rgba(153, 102, 255, 1)',
                                fill: false,
                            },
                            {
                                label: 'Air temp (C)',
                                data: temp,
                                borderColor: 'rgba(255, 159, 64, 1)',
                                fill: false,
                            },
                        ],
                    };

                    setChartData(chartData);
                } else {
                    console.error('Error getting data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching chart data:', error);
            } finally {
                setLoading(false);
            }
        }

        getChartData();

        const interval = setInterval(getChartData, 5000); 

        return () => clearInterval(interval); 
    }, [user, id]);

    if (isLoading || loading) return <p>Loading...</p>;
    if (!user) return <p>Not allowed.</p>;

    return <Line data={chartData} />;
}
