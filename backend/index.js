import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from 'express-oauth2-jwt-bearer';

const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));


// Get all users
app.get("/users", requireAuth, async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Get user by ID
app.get("/users/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Create a new user
app.post("/users", requireAuth, async (req, res) => {
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

// Update user by ID
app.put("/users/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        username,
        email,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete user by ID
app.delete("/users/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    });

    res.json(deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Get all movies
app.get("/movies", requireAuth, async (req, res) => {
  const movies = await prisma.movie.findMany();
  res.json(movies);
});

// Get movie by ID
app.get("/movies/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const movie = await prisma.movie.findUnique({
    where: {
      id,
    },
  });
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: "Movie not found" });
  }
});

// Create a new movie
app.post("/movies", requireAuth, async (req, res) => {
  const { name, artist, cover_image } = req.body;

  try {
    const newMovie = await prisma.movie.create({
      data: {
        name,
        artist,
        cover_image,
      },
    });

    res.status(201).json(newMovie);
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({ error: "Failed to create movie" });
  }
});

// Update movie by ID
app.put("/movies/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, artist, cover_image } = req.body;

  try {
    const updatedMovie = await prisma.movie.update({
      where: {
        id,
      },
      data: {
        name,
        artist,
        cover_image,
      },
    });

    res.json(updatedMovie);
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: "Failed to update movie" });
  }
});

// Delete movie by ID
app.delete("/movies/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMovie = await prisma.movie.delete({
      where: {
        id,
      },
    });

    res.json(deletedMovie);
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Failed to delete movie" });
  }
});

// Get all comments
app.get("/comments", requireAuth, async (req, res) => {
  const comments = await prisma.comment.findMany();
  res.json(comments);
});

// Get comments for a movie
app.get('/api/movies/:id/comments', async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        movieId: id,
      },
      include: {
        user: true,
      },
    });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching comments');
  }
});

// Add a comment to a movie
app.post('/comments', requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { text, movieId } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    const newComment = await prisma.comment.create({
      data: {
        text,
        movie: {
          connect: {
            id: movieId,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        datePosted: new Date(),
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating comment');
  }
});

// Get comments for a movie
app.get('/comments', async (req, res) => {
  const { movieId } = req.query;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        movieId: movieId,
      },
      include: {
        user: true,
      },
    });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching comments');
  }
});

// Get comment by ID
app.get("/comments/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });
  if (comment) {
    res.json(comment);
  } else {
    res.status(404).json({ error: "Comment not found" });
  }
});

// Create a new comment
app.post("/comments", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { comment, movieId } = req.body;

  if (!comment || !movieId) {
    res.status(400).send("Both comment and movieId are required");
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    const newComment = await prisma.comment.create({
      data: {
        comment,
        datePosted: new Date(),
        movie: { connect: { id: movieId } },
        user: { connect: { id: user.id } }, // Connect the comment to the user using the user's ID
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating comment');
  }
});


// Update comment by ID
app.put("/comments/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id,
      },
      data: {
        comment,
      },
    });

    res.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update comment" });
  }
});

// Delete comment by ID
app.delete("/comments/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComment = await prisma.comment.delete({
      where: {
        id,
      },
    });

    res.json(deletedComment);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
