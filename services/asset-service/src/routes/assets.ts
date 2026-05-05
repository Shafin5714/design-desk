import { Router } from 'express';
import multer from 'multer';
import ImageKit from 'imagekit';
import { Asset } from '../models/Asset';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Get ImageKit instance lazily since dotenv is loaded after imports
const getImageKit = () => new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
});

// Configure Multer for memory storage (we will upload the buffer directly to ImageKit)
const upload = multer({ storage: multer.memoryStorage() });

// Protect all routes
router.use(requireAuth);

// Get ImageKit Authentication Parameters (for direct client-side uploads if needed later)
router.get('/auth', (req, res) => {
  try {
    const result = getImageKit().getAuthenticationParameters();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get ImageKit auth parameters' });
  }
});

// Upload image (Server-side upload)
router.post('/upload', upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to ImageKit
    const uploadResponse = await getImageKit().upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: `/design-desk/users/${req.user!.id}`, // Organize by user
    });

    // Save metadata to MongoDB
    const asset = new Asset({
      userId: req.user!.id,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
      url: uploadResponse.url,
      thumbnailUrl: getImageKit().url({
        src: uploadResponse.url,
        transformation: [{ height: "300", width: "300" }]
      }),
      width: uploadResponse.width,
      height: uploadResponse.height,
    });

    await asset.save();
    
    res.status(201).json(asset);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get user's assets
router.get('/', async (req: AuthRequest, res) => {
  try {
    const assets = await Asset.find({ userId: req.user!.id }).sort({ createdAt: -1 });
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// Delete an asset
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const asset = await Asset.findOne({ _id: req.params.id, userId: req.user!.id });
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Delete from ImageKit
    await getImageKit().deleteFile(asset.fileId);

    // Delete from MongoDB
    await asset.deleteOne();

    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

export default router;
