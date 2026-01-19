import mongoose, { Schema, Document } from 'mongoose';

export interface IFloorSchema extends Document {
  number: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FloorSchema = new Schema<IFloorSchema>({
  number: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const FloorModel = mongoose.models.Floor || mongoose.model<IFloorSchema>('Floor', FloorSchema);

