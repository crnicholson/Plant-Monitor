'use client'
import { useState, useEffect } from "react";
import DeviceList from "../components/device_view";
import { Device } from "../templates/device";

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
      setStations(data.stations);
      setAliases(data.aliases);
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
    }
  };

  // text-[#4D5B7C]

  return (
    <>
      <div className="w-full h-[60px] bg-[#1433D6] text-white flex justify-start items-center">
        <h1 className=" text-2xl font-bold px-5">Plant Monitor Dashboard</h1>
      </div>
      {/* <div className="text-center w-full pt-5">
        <h1 className="text-3xl ">Welcome to the Plant Monitor Dashboard</h1>
        <p>Please login for access to the data dashboard.</p>
      </div> */}
      <div className=" w-full flex justify-center items-center">
        <div className="p-10 w-fit ">
          {!token ? (
            <div>
              <div className="mb-2">
                <h2 className="text-3xl">{isRegistering ? 'Register' : 'Login'}</h2>
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
                  className="p-2 px-3 bg-[#1433D6] hover:bg-blue-600 rounded-xl text-white"
                  onClick={isRegistering ? register : login}
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
      </div>
    </>
  );
}
