import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset extends Document {
  userId: mongoose.Types.ObjectId;
  fileId: string;      // ImageKit file ID
  name: string;        // Original file name
  url: string;         // ImageKit optimized URL
  thumbnailUrl: string; // ImageKit thumbnail URL
  width?: number;
  height?: number;
  createdAt: Date;
}

const AssetSchema = new Schema<IAsset>({
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  fileId: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  width: { type: Number },
  height: { type: Number },
}, { timestamps: true });

export const Asset = mongoose.model<IAsset>('Asset', AssetSchema);
