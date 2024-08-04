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
            <h1 className="text-2xl font-bold mb-2">Your Data</h1>
            <p>Manage your sensors.</p>
            <input className="w-fit h-10 my-2 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" placeholder="New station number" onChange={(event) => setNewSensor(event.target.value)} />
            <input className="w-fit h-10 m-3 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" placeholder="New station alias" onChange={(event) => setNewSensorAlias(event.target.value)} />
            <button
                className="h-fit w-fit p-2 bg-[#00335B] hover:bg-[#00345be3] text-white rounded-lg"
                onClick={() => addSensor(newSensor, newSensorAlias)}
            >
                Add
            </button>
            <div className="sensor-list mt-4">
                {sensorList.map(sensor => (
                    <Sensor key={sensor} station={sensor} />
                ))}
            </div>
        </>
    );
}
