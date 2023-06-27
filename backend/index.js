const express = require('express');
const cors = require('cors');
const axios = require('axios');
const qs = require('qs');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

const getSpotifyAccessToken = async () => {
  const url = 'https://accounts.spotify.com/api/token';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
  };
  const data = qs.stringify({
    'grant_type': 'client_credentials'
  });

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.access_token;
  } catch (err) {
    console.error(err);
  }
};
app.post("/users", async (req, res) => {
  const { username, email } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get('/tracks/:id/comments', async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        trackId: id,
      },
      include: {
        user: true
      }
    });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching comments');
  }
});

app.post('/tracks/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { userId, comment } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        track: {
          connect: {
            id: trackId,
          },
        },
        comment: comment,
      },
    });

    res.json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating comment');
  }
});

app.get('/search/:query', async (req, res) => {
  const { query } = req.params;
  const accessToken = await getSpotifyAccessToken();

  if (accessToken) {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      });

      const tracks = response.data.tracks.items.map(item => ({
        id: item.id,
        name: item.name,
        artist: item.artists[0].name,
        album: item.album.name,
        cover_image: item.album.images[0].url
      }));

      res.json(tracks);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error searching tracks');
    }
  } else {
    res.status(500).send('Error fetching Spotify access token');
  }
});

app.listen(8000, () => console.log('Server running on http://localhost:8000'));
