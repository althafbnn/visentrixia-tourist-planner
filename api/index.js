import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from '../backend/routes/authRoutes.js';
import placeRoutes from '../backend/routes/placeRoutes.js';
import itineraryRoutes from '../backend/routes/itineraryRoutes.js';
import adminRoutes from '../backend/routes/adminRoutes.js';
import { connectDB } from '../backend/db/connection.js';

dotenv.config();


let connectionPromise = null;

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(async (req, res, next) => {
  if (!connectionPromise) {
    connectionPromise = connectDB();
  }
  try {
    await connectionPromise;
    next();
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/admin', adminRoutes);

export default app;