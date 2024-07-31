from flask import Flask, request

app = Flask(__name__)


# @app.route("/devices", methods=["GET"])
# def get_data():
#     devices = request.args.getlist("devices")

#     print(f"Received data: {devices}")

#     response_data = {"message": "Data received successfully", "received_data": data}

#     return jsonify(response_data)


@app.route("/devices", methods=["POST"])
def get_data():
    data = request.get_json()
    print(data["message"])
    return data["message"], 200


if __name__ == "__main__":
    app.run(debug=True)
