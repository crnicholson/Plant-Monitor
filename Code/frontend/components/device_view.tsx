import Data from "./device_data";
import { Device } from "../templates/device";

interface DeviceListProps {
    devices: Device[];
}

export default function DeviceList({ devices }: DeviceListProps) {
    return (
        <div className="flex flex-wrap gap-4">
            {devices.map((device) => (
                <Data
                    key={device.device}
                    alias={device.alias}
                    device={device.device}
                    soilHumidity={device.soilHumidity}
                    airHumidity={device.airHumidity}
                    temperature={device.temperature}
                    pressure={device.pressure}
                />
            ))}
        </div>
    );
}