import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import assetRoutes from './routes/assets';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.ASSET_SERVICE_PORT || 4003;

app.use(cors());
app.use(express.json());

// Routes
app.use('/', assetRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Asset Service' });
});

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`🚀 Asset Service is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

startServer();
