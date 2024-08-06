// components/LineChart.tsx
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface CSVRow {
    TX_count: string;
    Device_number: string;
    Soil_humidity: string;
    Air_humidity: string;
    Temperature: string;
    Pressure: string;
    Time: string;
}

interface LineChartProps {
    csvData: string;
}

const LineChart: React.FC<LineChartProps> = ({ csvData }) => {
    const [chartData, setChartData] = useState<ChartData<'line'>>({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        // Parse the CSV data
        Papa.parse<CSVRow>(csvData, {
            header: true,
            complete: (results) => {
                const data = results.data as CSVRow[];
                const labels = data.map((row) => row.Time);
                const soilHumidity = data.map((row) => parseFloat(row.Soil_humidity));
                const airHumidity = data.map((row) => parseFloat(row.Air_humidity));
                const temperature = data.map((row) => parseFloat(row.Temperature));
                const pressure = data.map((row) => parseFloat(row.Pressure));

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Soil Humidity',
                            data: soilHumidity,
                            borderColor: 'rgba(75,192,192,1)',
                            backgroundColor: 'rgba(75,192,192,0.2)',
                            yAxisID: 'y',
                        },
                        {
                            label: 'Air Humidity',
                            data: airHumidity,
                            borderColor: 'rgba(153,102,255,1)',
                            backgroundColor: 'rgba(153,102,255,0.2)',
                            yAxisID: 'y',
                        },
                        {
                            label: 'Temperature',
                            data: temperature,
                            borderColor: 'rgba(255,159,64,1)',
                            backgroundColor: 'rgba(255,159,64,0.2)',
                            yAxisID: 'y',
                        },
                        {
                            label: 'Pressure',
                            data: pressure,
                            borderColor: 'rgba(255,99,132,1)',
                            backgroundColor: 'rgba(255,99,132,0.2)',
                            yAxisID: 'y1',
                        },
                    ],
                });
            },
            error: (error: Error) => {
                console.error('Error parsing CSV:', error.message);
            },
        });
    }, [csvData]);

    const options: ChartOptions<'line'> = {
        scales: {
            y: {
                type: 'linear',
                position: 'left',
            },
            y1: {
                type: 'linear',
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                mode: 'index',
            },
        },
    };

    return (
        <div>
            <h2>Line Chart</h2>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default LineChart;
