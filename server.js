import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './backend/routes/authRoutes.js';
import placeRoutes from './backend/routes/placeRoutes.js';
import itineraryRoutes from './backend/routes/itineraryRoutes.js';
import adminRoutes from './backend/routes/adminRoutes.js';
import { connectDB } from './backend/db/connection.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  await connectDB();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  app.use('/api/auth', authRoutes);
  app.use('/api/places', placeRoutes);
  app.use('/api/itineraries', itineraryRoutes);
  app.use('/api/admin', adminRoutes);

  app.get('/api/emergency-contacts', (req, res) => {
    res.json({
      success: true,
      emergencyContacts: [
        { name: 'Akkaraipattu Base Hospital', number: '+94 67 227 7222', type: 'Medical' },
        { name: 'Akkaraipattu Police Station', number: '+94 67 227 7223', type: 'Police' },
        { name: 'Sri Lanka Tourism Police Hotline', number: '1912', type: 'Tourism Hotline' },
        { name: 'Suwa Seriya National Ambulance', number: '1990', type: 'Emergency Ambulance' },
        { name: 'Ampara District Disaster Management', number: '+94 63 222 2011', type: 'Disaster Relief' }
      ],
      safetyGuidelines: [
        'Dress modestly when visiting sacred places like the Grand Jummah Mosque and Sri Sithira Velayudha Swami Kovil (shoulders and knees covered).',
        'Refrain from recreational sea bathing at Akkaraipattu shoreline due to steep drop-offs and strong seasonal rip currents.',
        'When exploring inland lakes like Sagamam and Pannalgama, conclude your visit before sunset due to twilight wild elephant movements.',
        'Stay well hydrated in the coastal tropical climate; drink coconut water or bottled water from local certified shops.',
        'Support local community livelihoods by engaging accredited tuk-tuk drivers and purchasing directly from artisanal handloom weavers.'
      ]
    });
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', app: 'VisEntrixia', timestamp: new Date().toISOString() });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VisEntrixia server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error(err);
});
