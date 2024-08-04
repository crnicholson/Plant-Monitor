import { useUser } from "@auth0/nextjs-auth0/client";

export default function Sensor(station: string) {
    const { user, error, isLoading } = useUser();

    const getStationData = async (station: string) => {
        const response = await fetch('http://127.0.0.1:5000/station-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "owner": user.name, "station": station }),
        });
        if (response.ok) {
            console.log("Recieved stations succesfully.");
            const data = await response.json();
            console.log(data);
        } else {
            console.error('Error getting data:', response.statusText);
        }
    };


    const updateAlias = async (station: string, alias: string) => {
        const response = await fetch('http://127.0.0.1:5000/update-alias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "owner": user.name, "station": station, "alias": alias }),
        });
        if (response.ok) {
            console.log("Set alias succesfully.");
        } else {
            console.error('Error getting data:', response.statusText);
        }
    };

    getStationData("station1"); // This should be polled every 5 seconds.

    return (
        <>
            <div className="w-fit h-fit p-3 text-gray-600 border rounded-lg focus:shadow-outline flex flex-row justify-evenly items-center">
                <div>
                    <h1 className="text-4xl font-bold">{data.alias}</h1>
                    <p className="text-xl italic">Sensor {data.device}</p>
                </div>
                <p>{data.soilHumidity}</p>
                <p>{data.humidity}</p>
                <p>{data.temperature}</p>
                <p>{data.pressure}</p>
                <div>
                    <input className="w-fit h-10 my-2 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" placeholder="Station alias." onChange={(event) => setStations(event.target.value)} />
                    <button
                        className="h-fit w-fit p-2 bg-[#00335B] hover:bg-[#00345be3] text-white rounded-lg"
                        onClick={sendStations(alias)}
                    ></button>
                </div>
            </div>
        </>
    )
}