import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from  'express-oauth2-jwt-bearer'

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

// Get all comments by a user
app.get("/comments", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  console.log(auth0Id)

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const comments = await prisma.comment.findMany({
    where: {
      userId: user.id,
    },
  });

  res.json(comments);
});

// Add a comment
app.post("/comments", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const { comment, movieId } = req.body;

  if (!comment || !movieId) {
    res.status(400).send("Both comment and movieId are required");
  } else {
    const newComment = await prisma.comment.create({
      data: {
        comment,
        datePosted: new Date(),
        movie: { connect: { id: movieId } },
        user: { connect: { auth0Id } },
      },
    });

    res.status(201).json(newComment);
  }
});

// Deletes a comment by id
app.delete("/comments/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const deletedComment = await prisma.comment.delete({
    where: {
      id,
    },
  });
  res.json(deletedComment);
});

// Get a movie by id
app.get("/movies/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const movie = await prisma.movie.findUnique({
    where: {
      id,
    },
  });
  res.json(movie);
});

// Update a comment by id
app.put("/comments/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const { comment } = req.body;
  const updatedComment = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      comment,
    },
  });
  res.json(updatedComment);
});

// Get profile information of authenticated user
app.get("/me", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  res.json(user);
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
