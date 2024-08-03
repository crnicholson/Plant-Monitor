import Link from 'next/link';

const SensorList = ({ sensors }: { sensors: any[] }) => {
    return (
        <div className="sensor-list">
            {sensors.map((sensor) => (
                <div key={sensor.name} className="sensor-item">
                    <Link href={`/sensor/${sensor.name}`}>
                        <a>{sensor.alias || sensor.name}</a>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default SensorList;
