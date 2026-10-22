import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from '../backend/routes/authRoutes.js';
import placeRoutes from '../backend/routes/placeRoutes.js';
import itineraryRoutes from '../backend/routes/itineraryRoutes.js';
import adminRoutes from '../backend/routes/adminRoutes.js';
import { connectDB } from '../backend/db/connection.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', app: 'VisEntrixia' });
});


export default app;