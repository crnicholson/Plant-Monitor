export default function Data(props: { alias: string, device: number, soilHumidity: number, airHumidity: number, temperature: number, pressure: number }) {
    return (
        <div className="p-2 border text-[#2a2f3c] border-black w-fit h-fit rounded-xl bg-gray-50">
            <h1 className="text-black text-2xl">{props.alias}</h1>
            <h1 className="text-lg">Station {props.device}</h1>
            <p className="pt-3">Soil humidity: {props.soilHumidity}%</p>
            <p>Air relative humidity: {props.airHumidity}%</p>
            <p>Air temperature: {props.temperature} C</p>
            <p>Air pressure: {props.pressure} hPa</p>
        </div>
    );
};