import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import projectRoutes from './routes/projects';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.PROJECT_SERVICE_PORT || 4002;

app.use(cors());
// Increase payload limit for large canvas node arrays
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/', projectRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Project Service' });
});

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`🚀 Project Service is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

startServer();
