import json
from flask import Flask, request, jsonify, send_file
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


def read_json(file):
    try:
        with open(file, "r") as file:
            return json.loads(file.read())
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return {}
    except Exception as e:
        print(f"Error reading file: {e}")
        return {}


def write_json(data, input):
    try:
        with open(input, "w") as file:
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
    station = int(received["station"])
    owner = received["owner"]
    users = read_json("users.json")
    if owner in users:
        path = f"{cwd}/data/{station}.csv"
        if os.path.exists(path):
            df = pd.read_csv(path)
            latest_data = df.iloc[-1]

            alias = ""
            for element in range(len(users[owner])):
                if users[owner][element] == station:
                    alias = users[owner][element + 1]
                    break

            packet = {
                "device": int(latest_data[1]),
                "soilHumidity": int(latest_data[2]),
                "humidity": int(latest_data[3]),
                "temperature": float(latest_data[4]),
                "pressure": float(latest_data[5]),
                "time": str(latest_data[6]),
                "frequency": int(latest_data[7]),
                "alias": alias,
            }

        json_response = json.dumps(packet)
        print("\nSending packet:\n" + json_response + " \n")
        return json_response, 200
    else:
        return "Unauthorized", 401


@app.route("/add-sensor", methods=["POST"])
def add_sensor():

    print("\n\nTHIS HAPPENED\n\n")

    received = request.get_json()

    station = str(received["station"])
    alias = received["alias"]
    owner = received["owner"]
    password = received["password"]
    users = read_json("users.json")
    stations = read_json("stations.json")

    print(f"\nReceived station: {station}")
    print(f"Stations: {stations}\n")

    if station not in stations:
        print(f"\nStation {station} does not exist.\n")
        return "Station does not exist.", 404

    if stations[station] != password:
        print("\nAdding sensor failed, password incorrect.\n")
        return "Password incorrect.", 401

    station = int(station)
    for name, sensors in users.items():
        if station in sensors:
            print("\nSensor already exists.\n")
            return "Sensor already exists.", 400

    if owner not in users:
        users[owner] = [station, alias]
    else:
        users[owner] += [station, alias]

    write_json(users, "users.json")
    return "Sensor added", 200


@app.route("/remove-sensor", methods=["POST"])
def remove_sensor():
    received = request.get_json()
    station = int(received["station"])
    owner = received["owner"]
    users = read_json("users.json")
    if owner in users:
        for element in range(len(users[owner])):
            print(element)
            if users[owner][element] == station:
                print(users[owner].pop(element))
                print(users[owner].pop(element))
                break
        write_json(users, "users.json")
        return "Sensor removed", 200
    else:
        return "Unauthorized", 401


@app.route("/get-station-list", methods=["POST"])
def get_station_list():
    received = request.get_json()
    owner = received["owner"]
    users = read_json("users.json")
    if owner in users:
        station_list = []
        for element in range(0, len(users[owner]), 2):
            station = users[owner][element]
            station_list.append(station)
        return jsonify({"stations": station_list}), 200
    else:
        return "Unauthorized", 401


@app.route("/update-alias", methods=["POST"])
def update_alias():
    received = request.get_json()
    station = int(received["station"])
    alias = received["alias"]
    owner = received["owner"]
    users = read_json("users.json")
    if owner in users:
        for i in range(0, len(users[owner]), 2):
            if users[owner][i] == station:
                users[owner][i + 1] = alias
                break
        write_json(users, "users.json")
        return "Alias updated", 200
    else:
        return "Unauthorized", 401


@app.route("/get-csv", methods=["POST"])
def get_csv():
    received = request.get_json()
    station = received["station"]

    path = f"{cwd}/data/{station}.csv"
    if os.path.exists(path):
        df = pd.read_csv(path)
        df.to_csv(path, index=False)
        return send_file(path, as_attachment=True)
    else:
        return "File not found.", 404


@app.route("/get-chart-data", methods=["POST"])
def get_chart_data():
    received = request.get_json()
    station = int(received["station"])
    path = f"{cwd}/data/{station}.csv"

    packet = {
        "soil": [],
        "humidity": [],
        "temp": [],
        "time": [],
    }

    if os.path.exists(path):
        df = pd.read_csv(path)
        for row in range(len(df)):
            soil = int(df.iloc[row, 2])
            humidity = int(df.iloc[row, 3])
            temp = int(df.iloc[row, 4])
            time = str(df.iloc[row, 6])
            packet["soil"].append(soil)
            packet["humidity"].append(humidity)
            packet["temp"].append(temp)
            packet["time"].append(time)

        return jsonify(packet), 200
    else:
        return "File not found.", 404


@app.route("/add-data", methods=["POST"])
def add_data():
    received = request.get_json()
    station = received["deviceID"]
    soilHumidity = received["soilHumidity"]
    airHumidity = received["airHumidity"]
    temperature = received["temperature"]
    pressure = received["pressure"]
    volts = received["volts"]
    txCount = received["txCount"]
    rxCount = received["rxCount"]
    frequency = received["frequency"]

    data = {
        "TX_count": txCount,
        "Device_number": station,
        "Soil_humidity": soilHumidity,
        "Air_humidity": airHumidity,
        "Temperature": temperature,
        "Pressure": pressure,
        "Time": pd.Timestamp.now(),
        "Frequency": frequency,
    }

    path = f"{cwd}/data/{station}.csv"

    if os.path.exists(path):
        df = pd.read_csv(path)
        df = df.append(data, ignore_index=True)
    else:
        df = pd.DataFrame([data])

    df.to_csv(path, index=False)
    return "Data added", 200


if __name__ == "__main__":
    app.run(debug=True, port=7359)
