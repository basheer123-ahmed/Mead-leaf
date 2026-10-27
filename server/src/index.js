import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'MedLeaf AI Backend',
    timestamp: new Date().toISOString()
  });
});

// Mock verified seed catalogue for demonstration / fallback when DB is connecting
export const SEED_PLANTS = [
  {
    id: "tulsi",
    commonName: "Tulsi (Holy Basil)",
    scientificName: "Ocimum sanctum",
    botanicalFamily: "Lamiaceae",
    category: "Herbal / Adaptogen",
    description: "Revered in traditional Ayurveda for respiratory balance, immune modulation, and stress reduction.",
    medicinalUses: "Supports bronchial wellness, relieves cold symptoms, antioxidant actions.",
    partsUsed: "Leaves, Stems, Seeds",
    habitat: "Tropical regions throughout India and Southeast Asia.",
    toxicityWarning: "Generally safe for consumption; excessive doses may interact with blood-thinning medications."
  },
  {
    id: "neem",
    commonName: "Neem",
    scientificName: "Azadirachta indica",
    botanicalFamily: "Meliaceae",
    category: "Antimicrobial",
    description: "Known as the village pharmacy, celebrated for antibacterial, antifungal, and skin-purifying properties.",
    medicinalUses: "Topical care for eczema, oral hygiene, traditional blood purification.",
    partsUsed: "Leaves, Bark, Seed Oil",
    habitat: "Native to the Indian subcontinent, thriving in arid and semi-arid conditions.",
    toxicityWarning: "Neem oil is toxic when ingested in large quantities, especially by young children."
  }
];

export const SEED_NUTS = [
  {
    id: "almond",
    commonName: "Almond",
    scientificName: "Prunus dulcis",
    category: "Tree Nut",
    description: "Nutrient-dense nut packed with monounsaturated fats, vitamin E, and magnesium.",
    allergenWarning: "Tree nut allergy alert. May cause severe allergic reactions in sensitive individuals.",
    storageInfo: "Store in a cool, airtight container away from direct sunlight to preserve freshness.",
    nutrition: {
      servingSize: "100g",
      calories: 579,
      proteinG: 21.15,
      fatG: 49.93,
      carbsG: 21.55,
      fiberG: 12.5
    }
  },
  {
    id: "walnut",
    commonName: "Walnut",
    scientificName: "Juglans regia",
    category: "Tree Nut",
    description: "Rich source of plant-based omega-3 fatty acids (alpha-linolenic acid) supporting cognitive and cardiovascular health.",
    allergenWarning: "Tree nut allergen. Cross-reactivity may occur with pecan and hazelnut.",
    storageInfo: "Keep refrigerated or frozen to prevent rancidity due to high polyunsaturated fat content.",
    nutrition: {
      servingSize: "100g",
      calories: 654,
      proteinG: 15.23,
      fatG: 65.21,
      carbsG: 13.71,
      fiberG: 6.7
    }
  }
];

// Public catalogue routes
app.get('/api/plants', (req, res) => {
  res.json({ success: true, count: SEED_PLANTS.length, data: SEED_PLANTS });
});

app.get('/api/plants/:id', (req, res) => {
  const plant = SEED_PLANTS.find(p => p.id === req.params.id);
  if (!plant) return res.status(404).json({ success: false, message: 'Plant not found' });
  res.json({ success: true, data: plant });
});

app.get('/api/nuts', (req, res) => {
  res.json({ success: true, count: SEED_NUTS.length, data: SEED_NUTS });
});

app.get('/api/nuts/:id', (req, res) => {
  const nut = SEED_NUTS.find(n => n.id === req.params.id);
  if (!nut) return res.status(404).json({ success: false, message: 'Nut not found' });
  res.json({ success: true, data: nut });
});

// Recognition prediction endpoints (routing to AI service or returning structured fallback)
app.post('/api/predictions/plants', (req, res) => {
  res.json({
    success: true,
    status: 'setup_required',
    message: 'Plant model inference service ready. Model weights need training on your custom dataset.',
    prediction: null
  });
});

app.post('/api/predictions/nuts', (req, res) => {
  res.json({
    success: true,
    status: 'setup_required',
    message: 'Nut model inference service ready. Model weights need training on your custom dataset.',
    prediction: null
  });
});

app.listen(PORT, () => {
  console.log(`🌿 MedLeaf Server running on http://localhost:${PORT}`);
});
