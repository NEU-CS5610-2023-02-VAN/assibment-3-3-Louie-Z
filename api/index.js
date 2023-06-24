const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
  });
  
app.post('/users', async (req, res) => {
const { username, email } = req.body;
const newUser = await prisma.user.create({
    data: {
    username,
    email,
    },
});
res.json(newUser);
});

app.get('/tracks', async (req, res) => {
    const tracks = await prisma.track.findMany();
    res.json(tracks);
  });
  
app.post('/tracks', async (req, res) => {
const { name, artist, album, cover_image } = req.body;
const newTrack = await prisma.track.create({
    data: {
    name,
    artist,
    album,
    cover_image,
    },
});
res.json(newTrack);
});

app.get('/comments', async (req, res) => {
    const comments = await prisma.comment.findMany();
    res.json(comments);
  });
  
app.post('/comments', async (req, res) => {
const { userId, trackId, comment } = req.body;
const newComment = await prisma.comment.create({
    data: {
    user: { connect: { id: userId } },
    track: { connect: { id: trackId } },
    comment,
    },
});
res.json(newComment);
});
  