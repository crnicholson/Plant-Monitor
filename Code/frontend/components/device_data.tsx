export default function Data(props: { device: number, soilHumidity: number, airHumidity: number, temperature: number, pressure: number }) {
    return (
        <div className="p-2 border border-black w-fit h-fit rounded-md bg-gray-100">
            <h1 className="text-2xl font-bold">Station {props.device}</h1>
            <p className="pt-3">Soil humidity: {props.soilHumidity}</p>
            <p>Air relative humidity: {props.airHumidity}%</p>
            <p>Air temperature: {props.temperature} C</p>
            <p>Air pressure: {props.pressure} hPa</p>
        </div>
    );
};