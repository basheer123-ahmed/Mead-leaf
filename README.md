# MedLeaf AI System Architecture & Setup Guide

## 1. Dataset & Model Inventory Report

| Item | Found in Repo | Status & Details |
|---|---|---|
| **Plant Leaf Dataset** | ❌ None | Need to place images in `ai-service/dataset/plants/<class_name>/` |
| **Nut / Dry Fruit Dataset**| ❌ None | Need to place images in `ai-service/dataset/nuts/<class_name>/` |
| **Trained Plant Weights** | ❌ None | Training script provided at `ai-service/train_plants.py` |
| **Trained Nut Weights** | ❌ None | Training script provided at `ai-service/train_nuts.py` |

> **Note on Model Status**: As per guidelines, no fake model predictions are generated when weights are missing. The application returns an explicit `"status": "setup_required"` message guiding the user to train models with their custom dataset.

---

## 2. System Architecture

- **Frontend**: Vite + Vanilla HTML5 / Modern CSS Glassmorphism + React modules (Port `5001`)
- **Backend**: Node.js + Express + Prisma ORM + MySQL (Port `5000`)
- **AI Service**: Python FastAPI + TensorFlow / Keras (Port `8000`)

---

## 3. How to Run

### Backend (Node.js & Express)
```bash
cd server
npm install
npx prisma generate
npm run dev
```

### AI Inference Service (FastAPI)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Training Plant Model
Place your images into folders:
```
ai-service/dataset/plants/
  ├── Tulsi/
  ├── Neem/
  └── AloeVera/
```
Run training:
```bash
python ai-service/train_plants.py --data ai-service/dataset/plants --output ai-service/models/plant_model.h5
```
