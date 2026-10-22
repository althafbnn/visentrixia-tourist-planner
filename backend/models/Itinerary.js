import mongoose from 'mongoose';

export const ItineraryStatus = ['draft', 'saved'];

const itinerarySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    userEmail: String,
    userName: String,
    title: { type: String, required: true },
    placeIds: { type: [String], validate: (v) => v.length > 0 },
    totalDistance: { type: Number, default: 0 },
    totalTravelTime: { type: Number, default: 0 },
    estimatedBudget: { type: Number, default: 0 },
    notes: { type: String, default: '' }
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

export const Itinerary = mongoose.model('Itinerary', itinerarySchema);
