from sentence_transformers import SentenceTransformer, util
import faiss
import numpy as np

# Load the model
model = SentenceTransformer("SeyedAli/Multilingual-Text-Semantic-Search-Siamese-BERT-V1")

# Sample capsules from the database
capsules = [
    {"id": "1", "description": "A beautiful sunset over the ocean."},
    {"id": "2", "description": "Family reunion memories from 2023."},
    {"id": "3", "description": "A thrilling skydiving adventure in Dubai."},
    {"id": "4", "description": "A peaceful hike through the forest."},
    {"id": "5", "description": "Graduation day with my best friends."},
    {"id": "6", "description": "Exploring ancient ruins in Rome."},
    {"id": "7", "description": "Camping under the stars in the desert."},
    {"id": "8", "description": "I got 7th ranked in cricket."},
    {"id": "9", "description": "I went to everest"},
    {"id": "10", "description": "10th anniversary of my brother."},
    {"id": "11", "description": " Birthday Party at my granny"}
]

# Encode all descriptions and store embeddings
descriptions = [capsule["description"] for capsule in capsules]
embeddings = model.encode(descriptions)

# Create a FAISS index for fast searching
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings, dtype="float32"))

# 🔎 Function to search for top 5 relevant capsules
def search_capsules(query, top_k=5):
    query_emb = model.encode([query])  # Encode user query
    distances, indices = index.search(np.array(query_emb, dtype="float32"), top_k)

    results = []
    for i in range(len(indices[0])):
        capsule_id = capsules[indices[0][i]]["id"]
        description = capsules[indices[0][i]]["description"]
        score = distances[0][i]
        results.append({"id": capsule_id, "description": description, "score": score})

    return results

# Test the search
query = "celebrations"
results = search_capsules(query)

# Print top 5 results
for res in results:
    print(f"ID: {res['id']}, Score: {res['score']:.4f}, Description: {res['description']}")
