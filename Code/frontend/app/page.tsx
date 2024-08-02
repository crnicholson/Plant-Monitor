'use client'
import { useState } from "react";
import DeviceList from "../components/device_view";
import { Device } from "../templates/device";

export default function Home() {
  const [input, updateInput] = useState('');
  const [devices, updateDevices] = useState<Device[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [stations, setStations] = useState('');
  const [aliases, setAliases] = useState('');

  const login = async () => {
    const response = await fetch('http://127.0.0.1:7359/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      setStations(data.stations);
      setAliases(data.aliases);
    } else {
      console.error('Login failed:', response.statusText);
    }
  };

  const sendDevices = async (message: string) => {
    if (!token) {
      console.error('Not authenticated');
      return;
    }

    const response = await fetch('http://127.0.0.1:7359/devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ devices: message }),
    });

    if (response.ok) {
      const devices: Device[] = await response.json();
      updateDevices(devices);
    } else {
      console.error('Error sending message:', response.statusText);
    }
  };

  const updateStations = async () => {
    if (!token) {
      console.error('Not authenticated');
      return;
    }

    const response = await fetch('http://127.0.0.1:7359/update-stations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ stations, aliases }),
    });

    if (response.ok) {
      console.log('Stations updated');
    } else {
      console.error('Error updating stations:', response.statusText);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-5xl font-bold">Plant Monitor Dashboard</h1>

      {!token ? (
        <div>
          <h2 className="text-3xl">Login</h2>
          <input
            className="p-2 my-2 mr-2 rounded-md border border-black"
            placeholder="Username"
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            className="p-2 my-2 mr-2 rounded-md border border-black"
            placeholder="Password"
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            className="p-2 border border-black rounded-md bg-gray-100 hover:bg-gray-200"
            onClick={login}
          >
            Login
          </button>
        </div>
      ) : (
        <>
          {/* <p className="pt-3">Enter the devices you want to be connected to, separated by commas.</p>
          <input
            className="p-2 my-4 mr-4 rounded-md border border-black"
            placeholder="Enter station numbers"
            onChange={(event) => updateInput(event.target.value)}
          /> */}
          <h1 className="pb-2 pt-5 text-3xl">Station Data</h1>
          {devices.length > 0 && <DeviceList devices={devices} />}

          <h2 className="text-3xl pt-5">Edit Stations</h2>
          <input
            className="p-2 my-4 mr-4 rounded-md border border-black"
            placeholder="Stations"
            value={stations}
            onChange={(event) => setStations(event.target.value)}
          />
          <input
            className="p-2 my-4 mr-4 rounded-md border border-black"
            placeholder="Aliases"
            value={aliases}
            onChange={(event) => setAliases(event.target.value)}
          />
          <button
            className="p-2 mr-4 border border-black rounded-md bg-gray-100 hover:bg-gray-200"
            onClick={updateStations}
          >
            Update station data
          </button>
          <button
            className="p-2 border border-black rounded-md bg-gray-100 hover:bg-gray-200"
            onClick={() => sendDevices(stations)}
          >
            Poll for data
          </button>
        </>
      )}
    </div>
  );
}
