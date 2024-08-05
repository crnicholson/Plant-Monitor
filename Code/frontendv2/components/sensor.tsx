import { useUser } from "@auth0/nextjs-auth0/client";
import { useState, useEffect } from "react";

interface StationData {
    alias: string;
    device: string;
    soilHumidity: number;
    humidity: number;
    temperature: number;
    pressure: number;
    time: string;
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
            console.error('Error updating alias:', response.statusText);
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
            {/* Desktop card */}
            <div className="hidden md:block w-full p-6 bg-white shadow-lg rounded-lg text-gray-700 transition duration-500 hover:scale-125 transform">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">{data?.alias || "Loading..."}</h1>
                        <p className="text-lg text-gray-500">Sensor: {data?.device || "Loading..."}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <input
                            className="w-32 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                            placeholder="Station alias"
                            onChange={(event) => setAlias(event.target.value)}
                            value={alias}
                        />
                        <button
                            className="h-10 px-4 bg-[#00335B] hover:bg-[#00345be3] text-white rounded-lg"
                            onClick={() => updateAlias(station, alias)}
                        >
                            Update
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold">Soil Humidity:</span>
                        <span>{data?.soilHumidity ?? "Loading..."}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold">Humidity:</span>
                        <span>{data?.humidity ?? "Loading..."}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold">Temperature:</span>
                        <span>{data?.temperature ?? "Loading..."}°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold">Pressure:</span>
                        <span>{data?.pressure ?? "Loading..."} hPa</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                        <span className="font-bold">Last Updated:</span>
                        <span>{data?.time ?? "Loading..."}</span>
                    </div>
                </div>
            </div>

            {/* Mobile card */}
            <div className="block md:hidden w-full p-4 bg-white shadow-md rounded-md text-gray-700">
                <div className="mb-4">
                    <h1 className="text-xl font-bold">{data?.alias || "Loading..."}</h1>
                    <p className="text-md text-gray-500">Sensor: {data?.device || "Loading..."}</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2">
                        <span className="font-bold">Soil Humidity:</span>
                        <span>{data?.soilHumidity ?? "Loading..."}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold">Humidity:</span>
                        <span>{data?.humidity ?? "Loading..."}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold">Temperature:</span>
                        <span>{data?.temperature ?? "Loading..."}°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold">Pressure:</span>
                        <span>{data?.pressure ?? "Loading..."} hPa</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold">Last Updated:</span>
                        <span>{data?.time ?? "Loading..."}</span>
                    </div>
                </div>
                <div className="mt-4">
                    <input
                        className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline mb-2"
                        placeholder="Station alias"
                        onChange={(event) => setAlias(event.target.value)}
                        value={alias}
                    />
                    <button
                        className="w-full h-10 bg-[#00335B] hover:bg-[#00345be3] text-white rounded-lg"
                        onClick={() => updateAlias(station, alias)}
                    >
                        Update
                    </button>
                </div>
            </div>
        </>
    );
}
