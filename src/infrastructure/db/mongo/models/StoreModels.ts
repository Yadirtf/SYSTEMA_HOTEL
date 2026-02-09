import mongoose, { Schema, Document } from 'mongoose';

// --- Categorías ---
export interface ProductCategoryDocument extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductCategorySchema = new Schema<ProductCategoryDocument>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const ProductCategoryModel = mongoose.models.ProductCategory || mongoose.model<ProductCategoryDocument>('ProductCategory', ProductCategorySchema);

// --- Unidades ---
export interface UnitDocument extends Document {
  name: string;
  abbreviation: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UnitSchema = new Schema<UnitDocument>({
  name: { type: String, required: true, unique: true },
  abbreviation: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const UnitModel = mongoose.models.Unit || mongoose.model<UnitDocument>('Unit', UnitSchema);

// --- Productos ---
export interface ProductDocument extends Document {
  name: string;
  description?: string;
  barcode?: string;
  categoryId: mongoose.Types.ObjectId;
  unitId: mongoose.Types.ObjectId;
  purchasePrice: number;
  salePrice: number;
  currentStock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  description: { type: String },
  barcode: { type: String, sparse: true, unique: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
  unitId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  purchasePrice: { type: Number, required: true, default: 0 },
  salePrice: { type: Number, required: true, default: 0 },
  currentStock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, strict: false });

// Forzar la recreación del modelo para evitar cache de esquemas viejos en desarrollo
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}
export const ProductModel = mongoose.model<ProductDocument>('Product', ProductSchema);

// --- Movimientos (Kardex) ---
export interface InventoryMovementDocument extends Document {
  productId: mongoose.Types.ObjectId;
  type: 'IN' | 'OUT';
  quantity: number;
  unitCost: number;
  reason: string;
  reference?: string;
  performedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryMovementSchema = new Schema<InventoryMovementDocument>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['IN', 'OUT'], required: true },
  quantity: { type: Number, required: true },
  unitCost: { type: Number, required: true },
  reason: { type: String, required: true },
  reference: { type: String },
  performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const InventoryMovementModel = mongoose.models.InventoryMovement || mongoose.model<InventoryMovementDocument>('InventoryMovement', InventoryMovementSchema);

// --- Ventas ---
export interface SaleDocument extends Document {
  items: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  totalAmount: number;
  paymentMethod: 'CASH' | 'TRANSFER' | 'CARD';
  performedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SaleSchema = new Schema<SaleDocument>({
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['CASH', 'TRANSFER', 'CARD'], required: true },
  performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const SaleModel = mongoose.models.Sale || mongoose.model<SaleDocument>('Sale', SaleSchema);

