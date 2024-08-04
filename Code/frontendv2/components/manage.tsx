import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";

export default function Manage() {
    const [stations, setStations] = useState('');
    const { user, error, isLoading } = useUser();

    if (user) {
        console.log(user);
    }

    const sendStations = async (keys: string) => {
        const response = await fetch('http://127.0.0.1:5000/send-stations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: user.name, stations: keys }),
        });
        if (response.ok) {
            console.log("Stations set successfully.");
        } else {
            console.error('Error sending message:', response.statusText);
        }
    };

    const fetchStations = async (keys: string) => {
        const response = await fetch('http://127.0.0.1:5000/fetch-stations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ stations: keys }),
        });
        if (response.ok) {
            console.log("Stations set successfully.");
        } else {
            console.error('Error sending message:', response.statusText);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-2">Manage</h1>
            <div className="w-fit">
                <p>Enter your station numbers, seperated by commas.</p>
                <div className="flex flex-row gap-4 items-center">
                    <input
                        className="w-fit h-10 my-2 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                        placeholder="Your stations."
                        value={stations}
                        onChange={(event) => setStations(event.target.value)}
                    />
                    <a className="h-fit w-fit p-2 bg-[#00335B] hover:bg-[#00345be3] text-white rounded-lg">Update</a>
                </div>
            </div>
        </>
    );
}