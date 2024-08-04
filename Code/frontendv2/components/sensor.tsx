import { useUser } from "@auth0/nextjs-auth0/client";
import { useState, useEffect } from "react";

interface StationData {
    alias: string;
    device: string;
    soilHumidity: number;
    humidity: number;
    temperature: number;
    pressure: number;
}

export default function Sensor({ station }: { station: string }) {
    const [alias, setAlias] = useState('');
    const [data, setData] = useState<StationData | null>(null);
    const { user, error, isLoading } = useUser();

    const getStationData = async (station: string) => {
        if (!user) return;

        const response = await fetch('http://127.0.0.1:5000/get-station-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "owner": user.name, "station": station }),
        });
        if (response.ok) {
            console.log("Received stations successfully.");
            const data = await response.json();
            setData(data);
        } else {
            console.error('Error getting data:', response.statusText);
        }
    };

    const updateAlias = async (station: string, alias: string) => {
        if (!user) return;

        const response = await fetch('http://127.0.0.1:5000/update-alias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "owner": user.name, "station": station, "alias": alias }),
        });
        if (response.ok) {
            console.log("Set alias successfully.");
        } else {
            console.error('Error getting data:', response.statusText);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            getStationData(station);
        }, 5000);

        return () => clearInterval(interval);
    }, [station, user]);

    return (
        <>
            <div className="w-fit h-fit p-3 text-gray-600 border rounded-lg focus:shadow-outline flex flex-row justify-evenly items-center">
                <div>
                    <h1 className="text-4xl font-bold">{data?.alias || "Loading..."}</h1>
                    <p className="text-xl italic">Sensor {data?.device || "Loading..."}</p>
                </div>
                <p>{data?.soilHumidity ?? "Loading..."}</p>
                <p>{data?.humidity ?? "Loading..."}</p>
                <p>{data?.temperature ?? "Loading..."}</p>
                <p>{data?.pressure ?? "Loading..."}</p>
                <div>
                    <input
                        className="w-fit h-10 my-2 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                        placeholder="Station alias"
                        onChange={(event) => setAlias(event.target.value)}
                        value={alias}
                    />
                    <button
                        className="h-fit w-fit p-2 bg-[#00335B] hover:bg-[#00345be3] text-white rounded-lg"
                        onClick={() => updateAlias(station, alias)}
                    >
                        Update
                    </button>
                </div>
            </div>
        </>
    );
}
