import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.ts';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
export const prisma = new PrismaClient(); // Export Prisma client for use in controllers/services

app.use(express.json()); // For parsing application/json

app.use('/api/auth', authRoutes); // Mount auth routes

app.get('/', (req, res) => {
  res.send('SaaS Boilerplate Backend is running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});