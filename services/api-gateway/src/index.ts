import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.PORT || 4000;

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate Limiting (General)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(limiter);

// --- Proxy Routes ---
// Note: We use proxy middleware instead of express.json() globally so that 
// multipart/form-data (file uploads) can pass through untouched to the target services.

// Auth Service (e.g. running on port 4001)
app.use('/api/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:4001',
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' },
}));

// Project Service (e.g. running on port 4002)
app.use('/api/projects', createProxyMiddleware({
  target: process.env.PROJECT_SERVICE_URL || 'http://localhost:4002',
  changeOrigin: true,
  pathRewrite: { '^/api/projects': '' },
}));

// Asset Service (e.g. running on port 4003)
app.use('/api/assets', createProxyMiddleware({
  target: process.env.ASSET_SERVICE_URL || 'http://localhost:4003',
  changeOrigin: true,
  pathRewrite: { '^/api/assets': '' },
}));

// Template Service (e.g. running on port 4004)
app.use('/api/templates', createProxyMiddleware({
  target: process.env.TEMPLATE_SERVICE_URL || 'http://localhost:4004',
  changeOrigin: true,
  pathRewrite: { '^/api/templates': '' },
}));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'API Gateway' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway is running on http://localhost:${PORT}`);
});
