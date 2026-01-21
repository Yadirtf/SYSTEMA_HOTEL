import { ProductCategory, Unit, Product, InventoryMovement, Sale } from "../entities/Store";

export interface StoreRepository {
  // Categorías
  createCategory(category: Partial<ProductCategory>): Promise<ProductCategory>;
  listCategories(): Promise<ProductCategory[]>;
  updateCategory(id: string, category: Partial<ProductCategory>): Promise<ProductCategory>;
  deleteCategory(id: string): Promise<void>;

  // Unidades
  createUnit(unit: Partial<Unit>): Promise<Unit>;
  listUnits(): Promise<Unit[]>;
  updateUnit(id: string, unit: Partial<Unit>): Promise<Unit>;
  deleteUnit(id: string): Promise<void>;

  // Productos
  createProduct(product: Partial<Product>): Promise<Product>;
  listProducts(): Promise<Product[]>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  updateStock(productId: string, quantity: number): Promise<void>;
  findProductByBarcode(barcode: string): Promise<Product | null>;
  findProductById(id: string): Promise<Product | null>;

  // Kardex
  registerMovement(movement: Partial<InventoryMovement>): Promise<InventoryMovement>;
  listMovements(filters?: { productId?: string; type?: string }): Promise<InventoryMovement[]>;

  // Ventas
  createSale(sale: Partial<Sale>): Promise<Sale>;
  listSales(): Promise<Sale[]>;
}
