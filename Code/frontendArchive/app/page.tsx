'use client'
import { useState, useEffect } from "react";
import DeviceList from "../components/device_view";
import { Device } from "../templates/device";
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import LineChart from '../components/chart';

export default function Home() {
  let accentColor = "#1433D6";

  const [input, updateInput] = useState('');
  const [devices, updateDevices] = useState<Device[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [stations, setStations] = useState('');
  const [aliases, setAliases] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [isEditing, setIsEditing] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    if (token && stations) {
      sendDevices(stations);
    }
  }, [token]);

  const register = async () => {
    setError(null);
    const response = await fetch('http://127.0.0.1:7359/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, stations, aliases }),
    });

    if (response.ok) {
      login();
    } else {
      const data = await response.json();
      setError(data.error || 'Registration failed');
    }
  };

  const login = async () => {
    setError(null);
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
      localStorage.setItem('token', data.token); // Save token to local storage
      setStations(data.stations.replace(",", ", "));
      setAliases(data.aliases.replace(",", ", "));
    } else {
      const data = await response.json();
      setError(data.error || 'Login failed');
    }
  };

  const sendDevices = async (keys: string) => {
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
      body: JSON.stringify({ devices: keys }),
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
      setError('One or more of your stations does not exist.');
    }
  };

  // text-[#4D5B7C]

  return (
    <>
      <div className="w-full h-[60px] bg-[#1433D6] text-white flex justify-between">
        <div className="flex w-fit justify-start items-center">
          <h1 className="text-2xl font-bold mx-5">Plant Monitor Dashboard</h1>
          <p>v1.0</p>
        </div>
        <div className="w-fit flex justify-end items-center mr-5 gap-5">
          {/* <Image
            src="/cat.webp"
            width={20}
            height={20}
            alt="GH logo"
          /> */}
          {/* <img src="/cat.webp" alt="cat" width={20} height={20} className="bg-transparent"/> */}
          <a target="_blank" href="https://github.com/crnicholson/Plant-Monitor" className="hover:underline">GitHub</a>
          <a href="/help" className="hover:underline">Help</a>
          <a href="/" className="hover:underline">Login/Signup</a>
        </div>
      </div>
      <div className=" w-full flex justify-center items-center">
        <div className="px-10 pt-5 w-fit ">
          {!token ? (
            <div>
              <div className="mb-2">
                <h2 className="text-3xl pb-2">{isRegistering ? 'Register' : 'Login'}</h2>
                <p className="my-2">{isRegistering ? 'Please enter at least 1 character for username and password.' : 'Please enter your username and password.'}</p>
                <input
                  className="p-2 my-2 mr-2 rounded-xl border border-black"
                  placeholder="Username"
                  onChange={(event) => setUsername(event.target.value)}
                  minLength={1}
                />
                <input
                  className="p-2 my-2 mr-2 rounded-xl border border-black"
                  placeholder="Password"
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={1}
                />
                {isRegistering && (
                  <>
                    <input
                      className="p-2 my-2 mr-2 rounded-xl border border-black"
                      placeholder="Stations"
                      onChange={(event) => setStations(event.target.value)}
                    />
                    <input
                      className="p-2 my-2 mr-2 rounded-xl border border-black"
                      placeholder="Aliases"
                      onChange={(event) => setAliases(event.target.value)}
                    />
                  </>
                )}

                <button
                  className="p-2 mt-2 bg-[#1433D6] hover:bg-blue-600 rounded-xl text-white"
                  onClick={isRegistering ? register : login}
                  disabled={username.length < 1 || password.length < 1}
                >
                  {isRegistering ? 'Register' : 'Login'}
                </button>
              </div>
              <div className="">
                {error && <div className="p-2 w-fit border rounded-xl bg-red-200 my-5 text-red-500">{error}</div>}
                <a className="underline mt-5 text-[#4D5B7C] hover:text-gray-400 cursor-pointer" onClick={() => setIsRegistering(!isRegistering)}>
                  {isRegistering ? "Already have an account?" : "Don't have an account? Create one."}
                </a>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h1 className="pb-4 pt-5 text-3xl">Your data</h1>
                {devices.length > 0 && <DeviceList devices={devices} />}
                <button
                  className="p-2 mt-5 px-3 bg-[#1433D6] hover:bg-blue-600 rounded-xl text-white w-full"
                  onClick={() => sendDevices(stations)}
                >
                  Poll for data
                </button>
              </div>

              <h1 className="text-3xl pt-10 pb-4">Edit your station information</h1>

              {/* <a className="underline mt-5 text-[#4D5B7C] hover:text-gray-400" onClick={() => setIsEditing(true)}>Want to edit station data?</a> */}
              {
                isEditing && (<>
                  <div className="w-fit h-fit border border-black p-3 bg-gray-100 rounded-xl flex flex-col gap-2">
                    <div>
                      <p>Enter your station numbers, seperated by commas.</p>
                      <input
                        className="bg-gray-50 p-2 my-4 mr-4 rounded-xl border border-black"
                        placeholder="Stations"
                        value={stations}
                        onChange={(event) => setStations(event.target.value)}
                      />
                    </div>
                    <div>
                      <p>Enter aliases for your station numbers, seperated by commas.</p>
                      <input
                        className="bg-gray-50 p-2 my-4 rounded-xl border border-black"
                        placeholder="Aliases"
                        value={aliases}
                        onChange={(event) => setAliases(event.target.value)}
                      />
                    </div>
                    <button
                      className="p-2 px-3 bg-[#1433D6] hover:bg-blue-600 rounded-xl text-white"
                      onClick={() => { updateStations(); sendDevices(stations); }}
                    >
                      Update station data
                    </button>
                    {error && <div className="p-2 w-fit border rounded-xl bg-red-200 my-5 text-red-500">{error}</div>}
                    <LineChart csvData="../../backend/data/1234.csv" />
                  </div>
                </>)}
            </>
          )}
        </div>
      </div>
    </>
  );
}


// export async function getStaticProps() {
//   const filePath = path.resolve('./data', 'your-file.csv');
//   const csvData = fs.readFileSync(filePath, 'utf8');

//   return {
//     props: {
//       csvData,
//     },
//   };
// }