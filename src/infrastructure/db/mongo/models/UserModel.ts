import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSchema extends Document {
  email: string;
  password: string;
  roleId: mongoose.Types.ObjectId;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserSchema>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  isActive: { type: Boolean, default: true },
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model<IUserSchema>('User', UserSchema);

