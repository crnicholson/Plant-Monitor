# if not working, run systemctl --user reload caddy

from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

devices = {
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
}


@app.route("/devices", methods=["POST"])
def get_data():
    # data = request.get_json()
    return devices, 200


if __name__ == "__main__":
    app.run(debug=True, port=7359)
