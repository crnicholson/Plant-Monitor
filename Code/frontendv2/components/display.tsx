import { useUser } from "@auth0/nextjs-auth0/client";
import { useState, useEffect } from "react";
import Sensor from "./sensor";

export default function Display() {
    const [newSensor, setNewSensor] = useState('');
    const [newSensorAlias, setNewSensorAlias] = useState('');
    const [sensorList, setSensorList] = useState([]);
    const { user, error, isLoading } = useUser();

    useEffect(() => {
        getStationList();
    }, [user]);

    const getStationList = async () => {
        if (!user) return;
        const response = await fetch('http://127.0.0.1:5000/get-station-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "owner": user.name }),
        });
        if (response.ok) {
            console.log("Received stations successfully.");
            const data = await response.json();
            setSensorList(data.stations);
        } else {
            console.error('Error getting data:', response.statusText);
        }
    };

    const addSensor = async (station: string, alias: string) => {
        if (!user) return;
        const response = await fetch('http://127.0.0.1:5000/add-sensor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "owner": user.name, "station": station, "alias": alias }),
        });
        if (response.ok) {
            console.log("Added stations successfully.");
            getStationList();
        } else {
            console.error('Error getting data:', response.statusText);
        }
    };

    return (
        <>
            <div className="bg-white p-6 shadow-lg rounded-lg text-gray-700">
                <h1 className="text-2xl font-bold mb-4">Add New Sensors</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <input
                        className="h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                        placeholder="New station number"
                        onChange={(event) => setNewSensor(event.target.value)}
                    />
                    <input
                        className="h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                        placeholder="New station alias"
                        onChange={(event) => setNewSensorAlias(event.target.value)}
                    />
                </div>
                <button
                    className="h-10 px-4 bg-[#00335B] hover:bg-[#00345be3] text-white rounded-lg w-full"
                    onClick={() => addSensor(newSensor, newSensorAlias)}
                >
                    Add
                </button>
            </div>
            <div className="sensor-list mt-3 flex gap-3 flex-col">
                <h1 className="mt-6 mb-1 text-3xl font-bold">Your Data</h1>
                {sensorList.map(sensor => (
                    <Sensor key={sensor} station={sensor} />
                ))}
            </div>
        </>
    );
}
