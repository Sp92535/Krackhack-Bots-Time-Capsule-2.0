from flask import Flask, request, jsonify, render_template
import cv2
import torch
from PIL import Image
from transformers import AutoModelForImageClassification, ViTImageProcessor
import numpy as np
import tempfile
import shutil
import os

# Load NSFW Model
model = AutoModelForImageClassification.from_pretrained("Falconsai/nsfw_image_detection")
processor = ViTImageProcessor.from_pretrained("Falconsai/nsfw_image_detection")

app = Flask(__name__)


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
    return jsonify({"message": "File uploaded successfully."})


@app.route("/upload/video", methods=["POST"])
@app.route("/upload/video", methods=["POST"])
def upload_video():
    file = request.files["file"]

    # Create a temp file and save the uploaded video
    temp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    temp.close()  # Close the file so it's not locked
    file.save(temp.name)

    cap = cv2.VideoCapture(temp.name)
    frame_interval = 30  # Sample every 30 frames
    nsfw_frames = 0
    total_analyzed_frames = 0

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        if total_analyzed_frames % frame_interval == 0:
            image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            label, confidence = check_nsfw(image)
            if label == "nsfw" and confidence > 0.7:
                cap.release()
                os.remove(temp.name)  # Now safe to delete
                return jsonify({"message": "NSFW video detected. Upload blocked."}), 400
        total_analyzed_frames += 1

    cap.release()
    os.remove(temp.name)  # Ensure cleanup after processing
    return jsonify({"message": "Video uploaded successfully."})


if __name__ == "__main__":
    app.run(debug=True)
