import { Router } from 'express';
import { Project } from '../models/Project';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Protect all project routes
router.use(requireAuth);

// Get all projects for current user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const projects = await Project.find({ userId: req.user!.id }).sort({ updatedAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create a new project
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, canvasNodes } = req.body;
    const project = new Project({
      userId: req.user!.id,
      name: name || 'Untitled Design',
      canvasNodes: canvasNodes || []
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get a single project
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user!.id });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Update a project
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { name, canvasNodes, thumbnailUrl } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      { $set: { name, canvasNodes, thumbnailUrl } },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete a project
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
