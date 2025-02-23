import os
import requests
from dotenv import load_dotenv

# ✅ Load environment variables from .env file
load_dotenv()

# ✅ Read API keys from .env file
IMAGGA_API_KEY = os.getenv("IMAGGA_API_KEY")
IMAGGA_API_SECRET = os.getenv("IMAGGA_API_SECRET")


def upload_image_to_imagga(image_path):
    """Uploads a local image to Imagga and returns the image URL."""
    with open(image_path, "rb") as image_file:
        response = requests.post(
            "https://api.imagga.com/v2/uploads",
            auth=(IMAGGA_API_KEY, IMAGGA_API_SECRET),
            files={"image": image_file}
        )

    if response.status_code == 200:
        uploaded_image = response.json()
        return uploaded_image["result"]["upload_id"]
    else:
        return None


def auto_tag_image(image_path):
    """Uploads a local image and fetches auto-tags using Imagga API."""

    # ✅ Step 1: Upload Image to Imagga
    upload_id = upload_image_to_imagga(image_path)
    if not upload_id:
        return "Error: Image upload failed!"

    # ✅ Step 2: Get tags for the uploaded image
    response = requests.get(
        f"https://api.imagga.com/v2/tags?image_upload_id={upload_id}",
        auth=(IMAGGA_API_KEY, IMAGGA_API_SECRET)
    )

    # ✅ Step 3: Process the response
    if response.status_code == 200:
        tags_data = response.json()
        tags = [tag['tag']['en'] for tag in tags_data["result"]["tags"][:5]]  # Get top 5 tags
        return tags
    else:
        return f"Error: {response.status_code}, {response.text}"


# ✅ Example Usage
image_path = r"C:\Users\aarya\Downloads\cricket.jpeg"  # Replace with actual local image path
tags = auto_tag_image(image_path)
print("Auto-generated Tags:", tags)
