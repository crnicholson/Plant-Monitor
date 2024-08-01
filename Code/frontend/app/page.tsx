'use client'
import { useState } from "react";

export default function Home() {
  const [result, updateResult] = useState('');

  const sendMessage = async (message: string) => {
    const response = await fetch('http://plant.cnicholson.hackclub.app/devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        devices: message
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Message sent successfully!');
      console.log(data);
      updateResult(data);
    } else {
      console.error('Error sending message:', response.statusText);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold">Plant Monitor Dashboard</h1>
      {/* <form onSubmit={() => sendMessage("testing")}>Click me</form> */}
      <button onClick={() => sendMessage("testing")}>Click me</button>
      <p>{result}</p>
    </>
  );
}