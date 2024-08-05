import { Line } from 'react-chartjs-2';
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Chart({ station }: { station: string }) {
    const { user, error, isLoading } = useUser();

    if (!user) return;

    const getChartData = async () => {
        const response = await fetch('http://127.0.0.1:5000/get-chart-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "owner": user.name, "station": station }),
        });
        if (response.ok) {
            console.log("Removed station successfully.");
            const data = await response.json();
            const soil = data["soil"]
            const humidity = data["humidity"]
            const temp = data["temp"]
            const time = data["time"]

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

            return chartData;
        } else {
            console.error('Error getting data:', response.statusText);
        }
    };

    // const chart = getChartData();

    const soil = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const humidity = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    const temp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const time = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

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

    // const options = {
    //     scales: {
    //         x: {
    //             type: 'time',
    //             time: {
    //                 unit: 'day',
    //             },
    //         },
    //     },
    // };

    return <Line data={chartData} />;
};