import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Track from './models/Track.js';

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
    // recupere les données de l'api deezer
    const deezerResponse = await fetch(`https://api.deezer.com/chart/0/tracks`);
    if (!deezerResponse.ok) {
      throw new Error('Failed to fetch from Deezer API');
    }
    // convertit la réponse en JSON
    const { data: tracksFromApi } = await deezerResponse.json();

    // Store or update tracks in MongoDB
    const trackPromises = tracksFromApi.map(trackData => {
      // parcours chaque track et prepare les donnees pour la BD
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
     
      // if existe deja, update sinon insert
      return Track.updateOne({ id: track.id }, track, { upsert: true });
    });
    
    // execute toutes les operations insert/update en parallele
    await Promise.all(trackPromises);
    console.log('Tracks have been successfully saved/updated in the database.');

    // reponse au client avec les tracks de l'api
    res.json(tracksFromApi);

  } catch (error) {
    console.error('Error in /api/tracks:', error);
    try {
      //recuperer tous les tracks de la BD, les trier par rank et limiter a 10
      const trackFromDb = await Track.find().sort({ rank: 'asc' }).limit(10);
      if (trackFromDb.length > 0) {
        res.json(trackFromDb);
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
