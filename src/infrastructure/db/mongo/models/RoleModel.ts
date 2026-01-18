import mongoose, { Schema, Document } from 'mongoose';

export interface IRoleSchema extends Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRoleSchema>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
}, { timestamps: true });

export const RoleModel = mongoose.models.Role || mongoose.model<IRoleSchema>('Role', RoleSchema);

