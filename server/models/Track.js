import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema for a track
const TrackSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  link: { type: String, required: true },
  rank: { type: Number, required: true },
  artist: {
    name: { type: String, required: true },
  },
  album: {
    cover_medium: { type: String },
  },
});

// Create the model from the schema
const Track = mongoose.model('Track', TrackSchema);

export default Track;
