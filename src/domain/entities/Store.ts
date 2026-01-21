export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Unit {
  id: string;
  name: string;
  abbreviation: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  barcode?: string;
  categoryId: string;
  categoryName?: string; // Para visualización
  unitId: string;
  unitName?: string; // Para visualización
  purchasePrice: number;
  salePrice: number;
  currentStock: number; // Cache para facilitar consultas rápidas
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type MovementType = 'IN' | 'OUT';

export interface InventoryMovement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  unitCost: number;
  reason: string; // Ej: 'COMPRA', 'VENTA', 'AJUSTE', 'CONSUMO_INTERNO'
  reference?: string; // ID de factura o venta
  performedBy: string; // ID del usuario
  createdAt: Date;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'CASH' | 'TRANSFER' | 'CARD';
  performedBy: string;
  createdAt: Date;
}

