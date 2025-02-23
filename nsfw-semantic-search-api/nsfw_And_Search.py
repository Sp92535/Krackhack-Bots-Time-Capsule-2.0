from flask import Flask, request, jsonify, render_template
import cv2
import torch
from PIL import Image
from transformers import AutoModelForImageClassification, ViTImageProcessor
import numpy as np
import tempfile
import shutil
import os
import requests
import faiss
from sentence_transformers import SentenceTransformer
from flask_cors import CORS

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Load NSFW Model
model = AutoModelForImageClassification.from_pretrained("Falconsai/nsfw_image_detection")
processor = ViTImageProcessor.from_pretrained("Falconsai/nsfw_image_detection")

# Load Sentence-BERT Model for Search
search_model = SentenceTransformer("SeyedAli/Multilingual-Text-Semantic-Search-Siamese-BERT-V1")

# API URL for Capsules
CAPSULES_API_URL = "http://localhost:6969/api/capsule/all-capsules"

# Global Storage for Capsules & FAISS Index
capsules = []
index = None

def check_nsfw(image):
    with torch.no_grad():
        inputs = processor(images=image, return_tensors="pt")
        outputs = model(**inputs)
        logits = outputs.logits
    probabilities = torch.nn.functional.softmax(logits, dim=-1)
    predicted_label = logits.argmax(-1).item()
    nsfw_score = probabilities[0][predicted_label].item()
    return model.config.id2label[predicted_label], nsfw_score

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/upload/image", methods=["POST"])
def upload_image():
    file = request.files["file"]
    image = Image.open(file).convert("RGB")
    label, confidence = check_nsfw(image)
    if label == "nsfw" and confidence > 0.7:
        return jsonify({"message": "NSFW content detected. Upload blocked."}), 400
    return jsonify({"message": "File uploaded successfully."}), 200

@app.route("/upload/video", methods=["POST"])
def upload_video():
    file = request.files["file"]
    temp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    temp.close()
    file.save(temp.name)
    cap = cv2.VideoCapture(temp.name)
    frame_interval = 30
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break
        image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        label, confidence = check_nsfw(image)
        if label == "nsfw" and confidence > 0.7:
            cap.release()
            os.remove(temp.name)
            return jsonify({"message": "NSFW video detected. Upload blocked."}), 400
    cap.release()
    os.remove(temp.name)
    return jsonify({"message": "Video uploaded successfully."}), 200

# Load Capsules and Create FAISS Index
def load_capsules():
    global capsules, index
    try:
        response = requests.get(CAPSULES_API_URL)
        response.raise_for_status()
        data = response.json()
        if isinstance(data, dict) and "capsules" in data:
            capsules = data["capsules"]
        else:
            print("⚠️ Unexpected response format")
            return
        if not capsules:
            print("⚠️ No capsules found in API response.")
            return
        descriptions = [capsule["description"] for capsule in capsules]
        embeddings = search_model.encode(descriptions)
        dimension = embeddings.shape[1]
        index = faiss.IndexFlatL2(dimension)
        index.add(np.array(embeddings, dtype="float32"))
        print(f"✅ Loaded {len(capsules)} capsules into FAISS index.")
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to fetch capsules: {e}")

@app.route("/api/capsule/reload", methods=["GET"])
def reload_capsules():
    load_capsules()
    return jsonify({"message": "Capsule data reloaded."})

@app.route("/api/capsule/search", methods=["GET"])
def search_capsule():
    query = request.args.get("query", "").strip()
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    if index is None or len(capsules) == 0:
        return jsonify({"error": "Capsule database is not loaded."}), 500
    query_emb = search_model.encode([query])
    distances, indices = index.search(np.array(query_emb, dtype="float32"), 5)
    seen_ids = set()
    filtered_capsules = []
    for i in range(len(indices[0])):
        capsule = capsules[indices[0][i]]
        capsule_id = capsule["id"]
        if capsule_id not in seen_ids:
            seen_ids.add(capsule_id)
            filtered_capsules.append(capsule)
    return jsonify({"capsules": filtered_capsules})

if __name__ == "__main__":
    load_capsules()
    app.run(host="0.0.0.0", port=5000, debug=True)
