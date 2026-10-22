import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { INITIAL_PLACES } from '../data/seedData.js';
import { Place } from '../models/Place.js';
import { User } from '../models/User.js';
import { Itinerary } from '../models/Itinerary.js';
import { AuditLog } from '../models/AuditLog.js';

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/visentrixia';

async function seedIfEmpty() {
  if ((await Place.countDocuments()) === 0) {
    await Place.insertMany(INITIAL_PLACES.map((p) => ({ ...p })));
  }

  if ((await User.countDocuments()) === 0) {
    const admin = await User.create({
      id: 'usr-admin-1',
      name: 'System Administrator',
      email: 'admin@visentrixia.lk',
      passwordHash: await bcrypt.hash('Admin@1234', 10),
      role: 'admin',
      contactNumber: '+94 67 227 7220'
    });
    const tourist = await User.create({
      id: 'usr-tourist-1',
      name: 'Ahamed (Tourist)',
      email: 'tourist@visentrixia.lk',
      passwordHash: await bcrypt.hash('Tourist@1234', 10),
      role: 'tourist',
      contactNumber: '+94 77 123 4567'
    });

    await Itinerary.create({
      id: 'itin-sample-1',
      userId: tourist.id,
      userEmail: tourist.email,
      userName: tourist.name,
      title: 'Akkaraipattu Cultural & Nature Heritage Tour',
      placeIds: ['place-1', 'place-4', 'place-3', 'place-2'],
      totalDistance: 33.9,
      totalTravelTime: 140,
      estimatedBudget: 200,
      notes: 'Family-friendly day trip exploring Grand Jummah Mosque morning prayer courtyard, evening food bazaar, and tranquil lake.'
    });

    await AuditLog.create({
      id: 'log-seed-1',
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'ADMIN_LOGIN',
      details: 'System initialized with 10 Akkaraipattu local attractions.'
    });
  }
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI || DEFAULT_URI;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
    await seedIfEmpty();
    return true;
  } catch (err) {
    console.error(`\nCould not connect to MongoDB at ${uri}`);
    console.error('Start MongoDB (mongod / MongoDB Compass / Atlas) and set MONGODB_URI in .env.\n');
    throw err;
  }
}
