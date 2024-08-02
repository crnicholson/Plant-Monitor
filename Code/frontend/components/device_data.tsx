import React from 'react';

export default function Data(props: { alias: string, device: number, soilHumidity: number, airHumidity: number, temperature: number, pressure: number }) {
    const downloadCSV = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Not authenticated');
            return;
        }

        const response = await fetch('http://127.0.0.1:7359/download-csv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ devices: props.device.toString() }),
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            console.error('Error downloading CSV:', response.statusText);
        }
    };

    return (
        <div className="p-2 border text-[#2a2f3c] border-black w-fit h-fit rounded-xl bg-gray-100">
            <h1 className="text-black text-2xl">{props.alias}</h1>
            <h1 className="text-lg italic">Station {props.device}</h1>
            <p className="pt-3">Soil humidity: {props.soilHumidity}%</p>
            <p>Air relative humidity: {props.airHumidity}%</p>
            <p>Air temperature: {props.temperature} C</p>
            <p>Air pressure: {props.pressure} hPa</p>
            <button onClick={downloadCSV} className="p-2 mt-2 w-full bg-[#1433D6] hover:bg-blue-600 rounded-xl text-white">
                Download CSV
            </button>
        </div>
    );
}
