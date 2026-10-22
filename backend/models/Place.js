import mongoose from 'mongoose';

export const PlaceCategory = ['Religious', 'Nature', 'Heritage', 'Cultural', 'Culinary'];

const placeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, minlength: 3 },
    category: { type: String, required: true, enum: PlaceCategory, index: true },
    description: { type: String, required: true, minlength: 10 },
    location: {
      lat: { type: Number, default: 7.2185 },
      lng: { type: Number, default: 81.8498 }
    },
    distance: { type: Number, required: true, min: 0, max: 25 },
    openingHours: { type: String, default: '08:00 AM - 06:00 PM' },
    entranceFee: { type: Number, min: 0, default: 0 },
    travelTips: { type: String, default: '' },
    safetyInfo: { type: String, default: '' },
    childFriendly: { type: Boolean, default: false },
    facilities: { type: [String], default: [] },
    images: { type: [String], default: [] }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const Place = mongoose.model('Place', placeSchema);
