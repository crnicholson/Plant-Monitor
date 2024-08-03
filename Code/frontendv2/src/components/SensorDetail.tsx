const SensorDetail = ({ data }: { data: any }) => {
    return (
        <div className="sensor-detail">
            {/* Render the detailed sensor data */}
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default SensorDetail;