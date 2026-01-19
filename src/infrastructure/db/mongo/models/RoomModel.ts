import mongoose, { Schema, Document } from 'mongoose';

export interface IRoomSchema extends Document {
  code: string;
  floorId: mongoose.Types.ObjectId;
  typeId: mongoose.Types.ObjectId;
  status: string;
  basePrice: number;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoomSchema>({
  code: { type: String, required: true },
  floorId: { type: Schema.Types.ObjectId, ref: 'Floor', required: true },
  typeId: { type: Schema.Types.ObjectId, ref: 'RoomType', required: true },
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING', 'MAINTENANCE'],
    default: 'AVAILABLE'
  },
  basePrice: { type: Number, required: true },
  description: { type: String, default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Índice único: No puede haber dos habitaciones con el mismo código en el mismo piso
RoomSchema.index({ code: 1, floorId: 1 }, { unique: true });

export const RoomModel = mongoose.models.Room || mongoose.model<IRoomSchema>('Room', RoomSchema);

