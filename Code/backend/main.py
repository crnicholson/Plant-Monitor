from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import pandas as pd
import secrets

app = Flask(__name__)
CORS(app)

cwd = os.getcwd()
users_file = os.path.join(cwd, "users.json")

# Load users from JSON file
if os.path.exists(users_file):
    with open(users_file, "r") as f:
        users = json.load(f)
else:
    users = {}


def save_users():
    with open(users_file, "w") as f:
        json.dump(users, f, indent=4)


@app.route("/register", methods=["POST"])
def register():
    received = request.get_json()
    username = received["username"]
    password = received["password"]
    stations = received["stations"].replace(", ", ",")
    aliases = received["aliases"].replace(", ", ",")

    if username in users:
        return jsonify({"error": "User already exists"}), 400

    users[username] = {
        "password": password,
        "stations": stations,
        "aliases": aliases,
        "token": None,
    }

    save_users()
    return "User created successfully", 201


@app.route("/login", methods=["POST"])
def login():
    received = request.get_json()
    username = received["username"]
    password = received["password"]

    user = users.get(username)
    if user and user["password"] == password:
        token = secrets.token_hex(16)
        user["token"] = token
        response = {
            "token": token,
            "stations": user["stations"],
            "aliases": user["aliases"],
        }
        save_users()
        return jsonify(response), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401


def validate_token(token):
    for user in users.values():
        if user["token"] == token:
            return user
    return None


@app.route("/devices", methods=["POST"])
def get_data():
    token = request.headers.get("Authorization")
    user = validate_token(token)
    if not user:
        return "Unauthorized", 401

    received = request.get_json()
    devices = received["devices"].replace(", ", ",").split(",")
    print(devices)

    jsonPacket = []

    for device in devices:
        device = int(device)
        path = f"{cwd}/data/{device}.csv"
        if os.path.exists(path):
            df = pd.read_csv(path)
            latest_data = df.iloc[-1]
            packet = {
                "alias": user["aliases"].split(",")[
                    user["stations"].split(",").index(str(device))
                ],
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


@app.route("/update-stations", methods=["POST"])
def update_stations():
    token = request.headers.get("Authorization")
    user = validate_token(token)
    if not user:
        return "Unauthorized", 401

    received = request.get_json()
    new_stations = received["stations"].replace(", ", ",")
    new_aliases = received["aliases"].replace(", ", ",")

    user["stations"] = new_stations
    user["aliases"] = new_aliases

    save_users()
    return "Success", 200


if __name__ == "__main__":
    app.run(debug=True, port=7359)
