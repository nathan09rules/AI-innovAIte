import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import tensorflow as tf  
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
import numpy as np
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Load tokenizers
with open("static/resources/tokenizer.json") as file:
    tokenizer = tokenizer_from_json(file.read())

with open("static/resources/ftokenizer.json") as file:
    ftokenizer = tokenizer_from_json(file.read())

# Load models
model = tf.keras.models.load_model("static/AI/Mental_Health.keras")
fmodel = tf.keras.models.load_model("static/AI/Feelings.keras")

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/journal')
def journal():
    return render_template('journal.html')

@app.route('/challenge')
def challenge():
    return render_template('challenges.html')

@app.route('/view')
def view():
    return render_template('view.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/breath')
def breath():
    return render_template('breath.html')

@app.route('/test')
def test():
    return render_template('test.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = str(data.get("input", ""))

    seq = tokenizer.texts_to_sequences([text])
    padded = pad_sequences(seq, padding='post', maxlen=50)
    prediction = model.predict(padded)
    print("M", prediction)

    prediction = int(prediction[0].flatten()[0])
    return jsonify({"dep": prediction})

@app.route('/write', methods=['POST'])
def write():
    data = request.get_json()

    with open("static/data/user.json", "w") as file:
        json.dump(data, file, indent=4)

    return jsonify({"status": "success"})  # Ensuring Flask returns a response

@app.route('/fpredict', methods=['POST'])
def fpredict():
    data = request.get_json().get("input", "")  
    sequence = ftokenizer.texts_to_sequences([data])  
    padded_sequence = pad_sequences(sequence, maxlen=100, padding='post')  
    prediction = fmodel.predict(padded_sequence)  
    print("F", prediction)

    predicted_class = int(np.argmax(prediction))  

    return jsonify({"feel": int(predicted_class)})

if __name__ == "__main__":
    app.run(debug=True)
