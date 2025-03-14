import os
os.environ["TF_ENABLE_OPTS"] = "0"

from flask import Flask , request , jsonify , render_template
from flask_cors import CORS
import json

import tensorflow as tf
import numpy as np


from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import tokenizer_from_json

# Load tokenizer from file
with open("static/resources/tokenizer.json") as file:
    tokenizer_json = file.read()
tokenizer = tokenizer_from_json(tokenizer_json)

with open("static/resources/ftokenizer.json") as file:
    tokenizer_json = file.read()
ftokenizer = tokenizer_from_json(tokenizer_json)

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

@app.route('/predict' , methods = ['POST'])
def predict():
    data = request.get_json()
    text = str(data.get("input" , ""))

    seq = tokenizer.texts_to_sequences([text])
    padded = pad_sequences(seq, padding='post', maxlen=50)
    prediction = fmodel.predict(padded)
    print("M",prediction)
    prediction = int(prediction[0].flatten()[0])
    return jsonify({"dep" : prediction})

@app.route('/fpredict' , methods = ['POST'])
def fpredict():
    data = request.json.get("input", "")  # Get text from the frontend
    sequence = ftokenizer.texts_to_sequences([data])  # Tokenize input text
    padded_sequence = pad_sequences(sequence, maxlen=100, padding='post')  # Pad input
    prediction = fmodel.predict(padded_sequence)  # Get prediction
    print("F",prediction)
    predicted_class = int(np.argmax(prediction))  # Get index of highest probability

    return jsonify({"feel": int(predicted_class)})


if __name__ == "__main__":
    app.run( debug = True )

