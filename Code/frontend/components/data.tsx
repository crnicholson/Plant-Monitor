export default function Data(props: { device: number, soilHumidity: number, humidity: number, temperature: number, pressure: number }) {
    return (
        <div className="m-4 p-2 border border-black w-fit h-fit rounded-md bg-gray-100">
            <h1 className="text-2xl font-bold">Station {props.device}</h1>
            <p className="pt-3">Soil humidity: {props.soilHumidity}</p>
            <p>Air relative humidity: {props.humidity}%</p>
            <p>Air temperature: {props.temperature} C</p>
            <p>Air pressure: {props.pressure} hPa</p>
        </div>
    );
};