import joblib
import librosa
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

clf_rf = joblib.load("API/MODEL/Random_forest.pkl")


def extract_features(audio_file):
    y, sr = librosa.load(audio_file, sr=None)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfccs = mfccs.T
    return np.mean(mfccs, axis=0)


@app.route('/predict', methods=['POST'])
def predict():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']

    if audio_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        audio_file.save("temp_audio.wav")
        test_data = extract_features("temp_audio.wav")
        test_data = np.array([test_data])
        pred_rf = clf_rf.predict(test_data)

        result = {"Random_Forest": "AI" if pred_rf == 1 else "Human"}

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/', methods=['GET'])
def hello():
    return '''<h1>HELLO WORLD testing<h1>
    <br>
    <a href="https://www.amazon.in/" target="blank">link</a>'''

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
