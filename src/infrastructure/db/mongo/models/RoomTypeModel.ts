import mongoose, { Schema, Document } from 'mongoose';

export interface IRoomTypeSchema extends Document {
  name: string;
  description: string | null;
  basePrice: number;
  capacity: number;
  extraPersonPrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomTypeSchema = new Schema<IRoomTypeSchema>({
  name: { type: String, required: true },
  description: { type: String, default: null },
  basePrice: { type: Number, required: true },
  capacity: { type: Number, required: true },
  extraPersonPrice: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const RoomTypeModel = mongoose.models.RoomType || mongoose.model<IRoomTypeSchema>('RoomType', RoomTypeSchema);

