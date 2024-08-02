import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
app.use(express.json());

// Connect to database
connectDB();

// Use routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});