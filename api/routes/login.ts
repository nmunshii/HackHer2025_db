import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import UserModel from '../models/User';

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

router.get('/', (req: Request, res: Response) => {
  res.json('Hello World');
});

router.post('/initUser', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: 'User with this email already exists' });
      return 
    }
    
    const newUser = await UserModel.create({
      email,
      password
    });
    res.status(201).json({ message: 'User registered successfully', data: newUser });
    return 
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return 
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc || userDoc.password !== password) {
      res.status(401).json({ error: 'Invalid email or password' });
      return 
    }
    const token = jwt.sign({ id: userDoc._id }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
    return 
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return 
  }
});

router.get('/profile', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err: Error | null, userData: any) => {
      if (err) {
        res.status(401).json({ message: 'Unauthorized' });
        return 
      }
      const user = await UserModel.findById(userData.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return 
      }
      res.json({
        email: user.email,
        _id: user._id,
      });
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

export default router;