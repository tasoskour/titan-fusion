import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const register = async (req: Request, res: Response) => {
  const { username, password, scopes } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ username, password: hashedPassword, scopes });
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).send('Server error');
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ username: user.username, scopes: user.scopes }, process.env.JWT_SECRET || 'your_secret_key', {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).send('Server error');
  }
};