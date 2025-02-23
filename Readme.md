# Timeless Treasures

## Overview
The **Timeless Treasures** is a full-stack web application that allows users to create, store, and lock digital memories (capsules) that can be unlocked at a future date. The platform supports media uploads, authentication, NSFW content detection, and a searchable capsule repository.

### Live Demo
[Timeless Treasures](https://timeless-treasures-psi.vercel.app/)

## Tech Stack
### Backend
- **Node.js, Express** (API development)
- **PostgreSQL, Sequelize** (Database)
- **Cloudflare R2** (File storage)
- **JWT & OAuth2** (Authentication)
- **Docker & Docker Compose** (Containerization)
- **Cron Jobs** (Automated capsule unlocking)

### Frontend
- **React, Vite** (UI development)
- **Tailwind CSS** (Styling)
- **Bun** (Package manager)

### NSFW Detection
- **Flask, Transformers (Hugging Face)** (NSFW image and video detection)
- **FAISS, Sentence-BERT** (Capsule search)

## Features
- User authentication (register, login, email verification)
- Securely create, upload, and store digital capsules
- Lock capsules with future unlock dates
- Explore public capsules
- NSFW content detection (images & videos)
- Capsule search using semantic search (FAISS & Sentence-BERT)

## Directory Structure
```
.
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Route controllers
│   │   ├── middlewares/      # Authentication middleware
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Helper utilities
│   │   ├── server.js         # Entry point
│   ├── docker-compose.yml    # Docker configuration
│   ├── Makefile              # Task automation
│   ├── package.json          # Dependencies
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Application pages
│   │   ├── config.js         # API configuration
│   ├── package.json          # Dependencies
│
├── nsfw-detection/           # Flask-based NSFW detection service
│   ├── app.py                # Flask app entry
│   ├── requirements.txt      # Python dependencies
│   ├── Procfile              # Deployment configuration
│
└── README.md                 # Project documentation
```

## Installation
### Prerequisites
- **Node.js** & **Bun** (Frontend package management)
- **PostgreSQL** (Database)
- **Docker** (Optional for containerized deployment)

### Backend Setup
```sh
cd backend
npm install
cp .env.example .env # Configure environment variables
npm run dev
```

### Frontend Setup
```sh
cd frontend
bun install
bun run dev
```

### NSFW Detection Setup
```sh
cd nsfw-detection
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

## API Routes
### Authentication
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/api/auth/register` | User registration |
| POST   | `/api/auth/login` | User login |
| GET    | `/api/auth/verify-email` | Verify email |

### Capsule Management
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/api/capsule/create-capsule` | Create a capsule |
| PUT    | `/api/capsule/update-capsule` | Update a capsule |
| GET    | `/api/capsule/my-capsules` | Get user-specific capsules |
| GET    | `/api/capsule/all-capsules` | Get all public capsules |
| POST   | `/api/capsule/upload` | Upload capsule data |
| PUT    | `/api/capsule/lock` | Lock a capsule |
| GET    | `/api/capsule/open/:capsuleId` | Open a capsule |
| DELETE | `/api/capsule/delete-capsule` | Delete a capsule |

### NSFW Detection
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/upload/image` | Detect NSFW content in an image |
| POST   | `/upload/video` | Detect NSFW content in a video |

## Environment Variables
Create a `.env` file in each service (`backend`, `frontend`, `nsfw-detection`) with necessary values.

### Backend `.env`
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_secret_key
CLOUDFLARE_R2_ACCESS_KEY=your_access_key
CLOUDFLARE_R2_SECRET_KEY=your_secret_key
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000
```

### NSFW Detection `.env`
```
NSFW_MODEL_PATH=models/nsfw_detector
```

## Deployment
### Using Docker
```sh
docker-compose up --build
```

### Manual Deployment
- **Backend**: Deploy via **Render, Railway, or AWS**.
- **Frontend**: Deploy via **Vercel or Netlify**.
- **NSFW Detection**: Deploy via **Render or Heroku**.

## Contributors
- `Aashay Aarya Nimish Sahil`

## License
This project is licensed under the SP License.

