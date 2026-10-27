import mongoose from 'mongoose';

// 1. User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Botanist' },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// 2. Scan History Schema
const ScanSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  plantId: { type: String, required: true },
  plantName: { type: String, required: true },
  scientificName: { type: String },
  category: { type: String, default: 'Medicinal Leaf' },
  confidence: { type: Number, required: true },
  imageUrl: { type: String },
  status: { type: String, default: 'completed' },
  timestamp: { type: Date, default: Date.now }
});

// 3. Saved Favorite Schema
const FavoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  plantId: { type: String, required: true },
  commonName: { type: String },
  scientificName: { type: String },
  category: { type: String, default: 'Medicinal Specimen' },
  savedAt: { type: Date, default: Date.now }
});

// 4. Botanical Plant Knowledgebase Schema
const PlantSchema = new mongoose.Schema({
  plantId: { type: String, required: true, unique: true },
  commonName: { type: String, required: true },
  scientificName: { type: String, required: true },
  localNames: { type: String },
  botanicalFamily: { type: String },
  medicinalProperties: [{ type: String }],
  traditionalUses: { type: String },
  potentialHealthBenefits: { type: String },
  partsUsed: [{ type: String }],
  preparationMethods: { type: String },
  precautions: { type: String },
  knownToxicity: { type: String },
  references: [{ title: String, source: String, url: String }],
  imageUrl: { type: String }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Scan = mongoose.models.Scan || mongoose.model('Scan', ScanSchema);
export const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
export const Plant = mongoose.models.Plant || mongoose.model('Plant', PlantSchema);
