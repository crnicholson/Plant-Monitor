# if not working, run systemctl --user reload caddy

from flask import Flask, request

app = Flask(__name__)


@app.route("/devices", methods=["POST"])
def get_data():
    data = request.get_json()
    print(data["devices"])
    return data["devices"], 200


if __name__ == "__main__":
    app.run(debug=True, port=7359)
