from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
from dotenv import load_dotenv
import json
import pandas as pd
import requests

cwd = os.getcwd()

load_dotenv(".env.local")

TOKEN = os.getenv("MGMT_API_ACCESS_TOKEN")

app = Flask(__name__)
CORS(app, supports_credentials=True)


def read_json():
    with open("users.json", "r") as file:
        return json.load(file)


def write_json(data):
    with open("users.json", "w") as file:
        json.dump(data, file, indent=4)


def get_users():
    response = requests.request(
        "GET",
        "https://dev-x5fymzmitaph36zd.us.auth0.com/api/v2/users",
        headers={"Accept": "application/json", "Authorization": TOKEN},
        data={},
    )
    return json.loads(response.text)


users = get_users()
print(len(users))
print(users[len(users) - 1]["name"])


@app.route("/get-station-data", methods=["POST"])
def get_data():
    received = request.get_json()
    station = int(received["station"])
    owner = received["owner"]

    data = read_json()
    if owner in data:
        print(station, owner)

        jsonPacket = []

        path = f"{cwd}/data/{station}.csv"
        if os.path.exists(path):
            df = pd.read_csv(path)
            latest_data = df.iloc[-1]
            if latest_data[0, -1] != owner:
                return "Unauthorized", 401
            packet = {
                "device": int(latest_data[1]),
                "soilHumidity": int(latest_data[2]),
                "humidity": int(latest_data[3]),
                "temperature": float(latest_data[4]),
                "pressure": float(latest_data[5]),
                "time": str(latest_data[6]),
                "alias": str(latest_data[7]),
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
    data = read_json()
    if owner in data == False:
        data[owner] = [station]
    if owner in data == True:
        data[owner] += [station]
    write_json(data)


if __name__ == "__main__":
    # app.run(debug=True, port=5000)
    pass
