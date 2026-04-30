import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  canvasNodes: any[]; // The JSON state from Zustand
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  name: { type: String, required: true, default: 'Untitled Design' },
  canvasNodes: [{ type: Schema.Types.Mixed }],
  thumbnailUrl: { type: String },
}, { timestamps: true });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
