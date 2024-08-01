# if not working, run systemctl --user reload caddy

from flask import Flask, request
from flask_cors import CORS
import os
import json
import pandas as pd

cwd = os.getcwd()

app = Flask(__name__)
CORS(app)

sample = [
    {
        "device": 1234,
        "soilHumidity": 50,
        "airHumidity": 50,
        "temperature": 25,
        "pressure": 1000,
    },
    {
        "device": 5678,
        "soilHumidity": 39,
        "airHumidity": 78,
        "temperature": 20,
        "pressure": 1250,
    },
]


@app.route("/devices", methods=["POST"])
def get_data():
    received = request.get_json()
    devices = received["devices"]
    devices = devices.replace(" ", "")
    devices = devices.split(",")
    print(devices)

    jsonPacket = []

    for device in devices:
        device = int(device)
        path = f"{cwd}/data/{device}.csv"
        if os.path.exists(path):
            df = pd.read_csv(path)
            latest_data = df.iloc[-1]
            packet = {
                "device": int(latest_data[1]),
                "soilHumidity": int(latest_data[2]),
                "airHumidity": int(latest_data[3]),
                "temperature": float(latest_data[4]),
                "pressure": float(latest_data[5]),
            }
            jsonPacket.append(packet)

    json_response = json.dumps(jsonPacket)
    print(json_response)
    return json_response, 200


if __name__ == "__main__":
    app.run(debug=True, port=7359)

    #  with open(path, "r") as f:
    #             data = json.load(f)
    #             key = data[str(len(data))]
    #             print(key)
    #         data[key].append(f"device: {device}")
    #         print(data[key])
    #         with open(path, "w") as f:
    #             json.dump(data, f, indent=4)
    #     else:
    #         return 404
