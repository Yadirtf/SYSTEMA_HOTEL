import mongoose, { Schema, Document } from 'mongoose';

export interface IPersonSchema extends Document {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  document: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const PersonSchema = new Schema<IPersonSchema>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  document: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
}, { timestamps: true });

export const PersonModel = mongoose.models.Person || mongoose.model<IPersonSchema>('Person', PersonSchema);

