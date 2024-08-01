'use client'
import { useState } from "react";
import Data from "../components/data";

export default function Home() {
  const [result, updateResult] = useState('');
  const [devices, updateDevices] = useState('');

  const sendMessage = async (message: string) => {
    const response = await fetch('https://plant.cnicholson.hackclub.app/devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        devices: message
      }),
    });

    if (response.ok) {
      const devices = await response.json();
      console.log('Message sent successfully!');
      // console.log(devices);
      updateResult(devices);
      console.log('Devices connected to:');
      for (let i = 0; i < devices.length; i++) {
        console.log(devices[i].device);
      }
    } else {
      console.error('Error sending message:', response.statusText);
    }
  };

  return (
    <>
      <div className="p-10">
        <h1 className="text-4xl font-bold">Plant Monitor Dashboard</h1>
        <p className="pt-3">Enter the devices you want to be connected to, seperated by commas.</p>
        <input className="p-2 my-4 mr-4 rounded-md border border-black" placeholder="Enter station numbers" onChange={(event) => updateDevices(event.target.value)} />
        <button className="p-2 border border-black rounded-md bg-gray-100 hover:bg-gray-200" onClick={() => sendMessage(devices)}>Submit station numbers</button>

        <Data
          device={1234}
          soilHumidity={50}
          humidity={50}
          temperature={50}
          pressure={50}
        />
      </div>
    </>
  );
}
