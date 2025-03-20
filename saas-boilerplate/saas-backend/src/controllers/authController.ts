import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'; // You'll need to install this: npm install bcryptjs @types/bcryptjs
import jwt from 'jsonwebtoken'; // You'll need to install this: npm install jsonwebtoken
import { prisma } from '../index'; // Import Prisma client

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'; // Fallback for development

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // 1. Check if user already exists (email unique)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user in database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error });
  }
};

export const login = async (req: Request, res: Response) => {
  // ... (Login logic - similar to register, but verify password and generate JWT) ...
  // ... (Generate JWT token upon successful login) ...
  // Example JWT generation (simplified):
  const token = jwt.sign({ userId: 'some-user-id' }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token }); // Send token back to frontend
};

export const getCurrentUser = async (req: Request, res: Response) => {
    // Middleware `authenticate` (next step) will attach user to `req.user`
    // @ts-ignore - we'll augment the Request interface in middleware later for `user`
    const user = req.user;
    res.json({ user });
};