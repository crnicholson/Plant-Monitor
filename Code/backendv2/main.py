import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import pandas as pd
import requests

cwd = os.getcwd()

load_dotenv(".env.local")

TOKEN = os.getenv("MGMT_API_ACCESS_TOKEN")

app = Flask(__name__)
CORS(app)


def read_json():
    try:
        with open("users.json", "r") as file:
            return json.loads(file.read())
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return {}
    except Exception as e:
        print(f"Error reading file: {e}")
        return {}


def write_json(data):
    try:
        with open("users.json", "w") as file:
            json.dump(data, file, indent=4)
    except Exception as e:
        print(f"Error writing JSON: {e}")


def get_users():
    response = requests.get(
        "https://dev-x5fymzmitaph36zd.us.auth0.com/api/v2/users",
        headers={"Accept": "application/json", "Authorization": TOKEN},
    )
    return response.json()


@app.route("/get-station-data", methods=["POST"])
def get_data():
    received = request.get_json()
    print(received)
    station = int(received["station"])
    owner = received["owner"]
    print(station, owner)
    data = read_json()
    if owner in data:
        jsonPacket = []

        path = f"{cwd}/data/{station}.csv"
        if os.path.exists(path):
            df = pd.read_csv(path)
            latest_data = df.iloc[-1]

            alias = ""
            for element in range(len(data[owner])):
                if element == station:
                    alias = data[owner][element]
                    break

            packet = {
                "device": int(latest_data[1]),
                "soilHumidity": int(latest_data[2]),
                "humidity": int(latest_data[3]),
                "temperature": float(latest_data[4]),
                "pressure": float(latest_data[5]),
                "time": str(latest_data[6]),
                "alias": alias,
            }
            jsonPacket.append(packet)

        json_response = json.dumps(jsonPacket)
        print(json_response)
        return json_response, 200
    else:
        return "Unauthorized", 401


@app.route("/add-sensor", methods=["POST"])
def add_sensor():
    received = request.get_json()
    station = int(received["station"])
    alias = received["alias"]
    owner = received["owner"]
    print(station, alias, owner)
    data = read_json()
    print(data)
    if owner not in data:
        data[owner] = [station, alias]
    else:
        data[owner] += [station, alias]
    write_json(data)
    return "Sensor added", 200


@app.route("/get-station-list", methods=["POST"])
def get_station_list():
    received = request.get_json()
    owner = received["owner"]
    data = read_json()
    if owner in data:
        print(data[owner])
        station_list = []
        for element in range(0, len(data[owner]), 2):
            station = data[owner][element]
            station_list.append(station)
            print(station)
            print({"stations": station_list})
        return jsonify({"stations": station_list}), 200
    else:
        return "Unauthorized", 401


@app.route("/update-alias", methods=["POST"])
def update_alias():
    received = request.get_json()
    station = int(received["station"])
    alias = received["alias"]
    owner = received["owner"]
    data = read_json()
    if owner in data:
        for i in range(0, len(data[owner]), 2):
            if data[owner][i] == station:
                data[owner][i + 1] = alias
                break
        write_json(data)
        return "Alias updated", 200
    else:
        return "Unauthorized", 401


if __name__ == "__main__":
    app.run(debug=True, port=5000)
