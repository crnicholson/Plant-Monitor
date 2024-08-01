'use client'
import { useState } from "react";
import DeviceList from "../components/device_view";
import { Device } from "../templates/device";

export default function Home() {
  const [input, updateInput] = useState('');
  const [devices, updateDevices] = useState<Device[]>([]);

  const sendDevices = async (message: string) => {
    const response = await fetch('http://127.0.0.1:7359/devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        devices: message
      }),
    });

    if (response.ok) {
      const devices: Device[] = await response.json();
      updateDevices(devices);
    } else {
      console.error('Error sending message:', response.statusText);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-5xl font-bold">Plant Monitor Dashboard</h1>
      <p className="pt-3">Enter the devices you want to be connected to, separated by commas.</p>
      <input
        className="p-2 my-4 mr-4 rounded-md border border-black"
        placeholder="Enter station numbers"
        onChange={(event) => updateInput(event.target.value)}
      />
      <button
        className="p-2 border border-black rounded-md bg-gray-100 hover:bg-gray-200"
        onClick={() => sendDevices(input)}
      >
        Submit station numbers
      </button>

      <h1 className="pb-2 pt-5 text-3xl font-bold">Station Data</h1>
      <p className="pb-4">Remember to upload station names! New data is polled when you submit station numbers.</p>
      {devices.length > 0 && <DeviceList devices={devices} />}
    </div>
  );
}

