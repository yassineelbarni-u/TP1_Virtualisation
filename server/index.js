// Import necessary packages
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Track from './models/Track.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

/**
 * API endpoint to get top tracks.
 * It fetches tracks from an external API, stores/updates them in MongoDB,
 * and then returns them to the client.
 */
app.get('/api/tracks', async (req, res) => {
  try {
    // 1. Fetch data from the external Deezer API
    const deezerResponse = await fetch(`https://api.deezer.com/chart/0/tracks`);
    if (!deezerResponse.ok) {
      throw new Error('Failed to fetch from Deezer API');
    }
    const { data: tracksFromApi } = await deezerResponse.json();

    // 2. Store or update tracks in MongoDB
    const trackPromises = tracksFromApi.map(trackData => {
      const track = {
        id: trackData.id,
        title: trackData.title,
        link: trackData.link,
        rank: trackData.rank,
        artist: {
          name: trackData.artist.name,
        },
        album: {
          cover_medium: trackData.album.cover_medium,
        },
      };

      // Use updateOne with 'upsert: true' to either update an existing track or insert a new one.
      return Track.updateOne({ id: track.id }, track, { upsert: true });
    });

    await Promise.all(trackPromises);
    console.log('Tracks have been successfully saved/updated in the database.');

    // 3. Send the fresh tracks list to the client
    res.json(tracksFromApi);

  } catch (error) {
    console.error('Error in /api/tracks:', error);
    // If something goes wrong, try to send tracks from the database as a fallback
    try {
      const tracksFromDb = await Track.find().sort({ rank: 'asc' }).limit(10);
      if (tracksFromDb.length > 0) {
        res.json(tracksFromDb);
      } else {
        res.status(500).json({ message: 'Server error and no tracks in DB' });
      }
    } catch (dbError) {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
