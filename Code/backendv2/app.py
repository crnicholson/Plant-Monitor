from flask import Flask, request, jsonify
from flask_restful import Api
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///sensors.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"

db = SQLAlchemy(app)
api = Api(app)
jwt = JWTManager(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)


class Sensor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    name = db.Column(db.String(80), unique=True, nullable=False)
    alias = db.Column(db.String(120), nullable=True)
    user = db.relationship("User", backref=db.backref("sensors", lazy=True))


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data["password"], method="sha256")
    new_user = User(username=data["username"], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"})


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data["username"]).first()
    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401
    access_token = create_access_token(identity={"username": user.username})
    return jsonify(access_token=access_token)


@app.route("/sensors", methods=["GET", "POST"])
@jwt_required()
def manage_sensors():
    if request.method == "POST":
        data = request.get_json()
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user["username"]).first()
        new_sensor = Sensor(name=data["name"], alias=data.get("alias"), user=user)
        db.session.add(new_sensor)
        db.session.commit()
        return jsonify({"message": "Sensor added successfully"})
    else:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user["username"]).first()
        sensors = Sensor.query.filter_by(user=user).all()
        return jsonify(
            sensors=[{"name": sensor.name, "alias": sensor.alias} for sensor in sensors]
        )


@app.route("/sensor/<name>", methods=["GET"])
@jwt_required()
def get_sensor_data(name):
    # Implement logic to read CSV data for the sensor and return it as JSON
    pass


if __name__ == "__main__":
    app.run(debug=True)
