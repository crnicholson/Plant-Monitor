import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";

require('dotenv').config();

export default function Manage() {
    const [stations, setStations] = useState('');
    const [aliases, setAliases] = useState('');
    const { user, error, isLoading } = useUser();

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
                <p>Enter your station numbers and aliases, separated by commas.</p>
                <div className="flex flex-row gap-4 items-center">
                    <input
                        className="w-fit h-10 my-2 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                        placeholder="Your stations."
                        value={stations}
                        onChange={(event) => setStations(event.target.value)}
                    />
                    <button
                        className="h-fit w-fit p-2 bg-[#00335B] hover:bg-[#00345be3] text-white rounded-lg"
                        onClick={sendStations(stations)}
                    >
                        Update
                    </button>
                </div>
            </div>
        </>
    );
}

// const MGMT_API_ACCESS_TOKEN = process.env.MGMT_API_ACCESS_TOKEN;

// const updateUser = async (metadata) => {
//     try {
//         const response = await fetch(`https://dev-x5fymzmitaph36zd.us.auth0.com/api/v2/users/${user.sub}`, {
//             method: 'PATCH',
//             headers: {
//                 'Authorization': MGMT_API_ACCESS_TOKEN,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 user_metadata: metadata
//             })
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok ' + response.statusText);
//         }

//         const data = await response.json();
//         console.log(data);
//     } catch (error) {
//         console.error('There was a problem with your fetch operation:', error);
//     }
// };