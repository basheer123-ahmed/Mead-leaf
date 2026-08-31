export default function handler(req, res) {
  const plants = [
    {
      id: 'tulsi',
      commonName: 'Tulsi (Holy Basil)',
      scientificName: 'Ocimum sanctum',
      category: 'Herbal / Adaptogen',
      description: 'Known as the "Queen of Herbs", Tulsi is an adaptogenic herb revered in traditional Ayurvedic medicine for its potent respiratory, antimicrobial, and stress-relieving properties.',
      imageUrl: '/assets/images/tulsi_real.jpg'
    },
    {
      id: 'neem',
      commonName: 'Neem',
      scientificName: 'Azadirachta indica',
      category: 'Antimicrobial',
      description: 'Celebrated for its broad-spectrum antimicrobial, antifungal, and anti-inflammatory attributes.',
      imageUrl: '/assets/images/neem_real.jpg'
    },
    {
      id: 'aloe',
      commonName: 'Aloe Vera',
      scientificName: 'Aloe barbadensis Miller',
      category: 'Dermal Soothing',
      description: 'A succulent rich in acemannan, vitamins, and antioxidants. Widely used for thermal soothing and dermal regeneration.',
      imageUrl: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'ashwagandha',
      commonName: 'Ashwagandha',
      scientificName: 'Withania somnifera',
      category: 'Vitality / Tonic',
      description: 'A revered restorative Rasayana herb in Ayurveda, known for modulating cortisol, supporting cognitive clarity, and boosting cellular vitality.',
      imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'moringa',
      commonName: 'Moringa (Drumstick Tree)',
      scientificName: 'Moringa oleifera',
      category: 'Nutrient Superfood',
      description: 'A nutrient-dense superfood herb containing 7x more Vitamin C than oranges and dense polyphenol antioxidants.',
      imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'mint',
      commonName: 'Mint (Peppermint)',
      scientificName: 'Mentha piperita',
      category: 'Digestive Herb',
      description: 'A cooling therapeutic aromatic herb high in menthol, widely recognized for digestive easing and respiratory decongestion.',
      imageUrl: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=800&q=80'
    }
  ];

  res.status(200).json({
    success: true,
    count: plants.length,
    data: plants
  });
}
