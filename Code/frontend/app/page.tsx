export default function Home() {
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
      const data = await response.json();
      console.log('Message sent successfully!');
      console.log(data);
    } else {
      console.error('Error sending message:', response.statusText);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold">Plant Monitor Dashboard</h1>
      <form onSubmit={() => sendMessage("testing")}>Click me</form>
    </>
  );
}