import { StoreRepository } from "@/domain/repositories/StoreRepository";
import { ProductCategory, Unit, Product, InventoryMovement, Sale } from "@/domain/entities/Store";
import { ProductCategoryModel, UnitModel, ProductModel, InventoryMovementModel, SaleModel } from "../db/mongo/models/StoreModels";
import { StoreMapper } from "../mappers/StoreMapper";

export class MongoStoreRepository implements StoreRepository {
  // Categorías
  async createCategory(category: Partial<ProductCategory>): Promise<ProductCategory> {
    const doc = await ProductCategoryModel.create(category);
    return StoreMapper.toCategoryEntity(doc);
  }

  async listCategories(): Promise<ProductCategory[]> {
    const docs = await ProductCategoryModel.find().sort({ name: 1 });
    return docs.map(StoreMapper.toCategoryEntity);
  }

  async updateCategory(id: string, category: Partial<ProductCategory>): Promise<ProductCategory> {
    const doc = await ProductCategoryModel.findByIdAndUpdate(id, category, { new: true });
    if (!doc) throw new Error('CATEGORY_NOT_FOUND');
    return StoreMapper.toCategoryEntity(doc);
  }

  async deleteCategory(id: string): Promise<void> {
    await ProductCategoryModel.findByIdAndDelete(id);
  }

  // Unidades
  async createUnit(unit: Partial<Unit>): Promise<Unit> {
    const doc = await UnitModel.create(unit);
    return StoreMapper.toUnitEntity(doc);
  }

  async listUnits(): Promise<Unit[]> {
    const docs = await UnitModel.find().sort({ name: 1 });
    return docs.map(StoreMapper.toUnitEntity);
  }

  async updateUnit(id: string, unit: Partial<Unit>): Promise<Unit> {
    const doc = await UnitModel.findByIdAndUpdate(id, unit, { new: true });
    if (!doc) throw new Error('UNIT_NOT_FOUND');
    return StoreMapper.toUnitEntity(doc);
  }

  async deleteUnit(id: string): Promise<void> {
    await UnitModel.findByIdAndDelete(id);
  }

  // Productos
  async createProduct(product: Partial<Product>): Promise<Product> {
    const data = { ...product };
    // Asegurarse de que si viene como string vacío, sea undefined para sparse index
    if (!data.barcode || data.barcode.trim() === '') {
      delete data.barcode;
    }
    const doc = await ProductModel.create(data);
    return StoreMapper.toProductEntity(doc);
  }

  async listProducts(): Promise<Product[]> {
    const docs = await ProductModel.find()
      .populate('categoryId')
      .populate('unitId')
      .sort({ name: 1 });
    return docs.map(StoreMapper.toProductEntity);
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const data = { ...product };
    // Asegurarse de que si viene como string vacío, sea undefined para sparse index
    if (data.barcode === '') {
      // @ts-ignore
      data.barcode = undefined; 
    }
    const doc = await ProductModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) throw new Error('PRODUCT_NOT_FOUND');
    return StoreMapper.toProductEntity(doc);
  }

  async deleteProduct(id: string): Promise<void> {
    await ProductModel.findByIdAndDelete(id);
  }

  async updateStock(productId: string, quantity: number): Promise<void> {
    await ProductModel.findByIdAndUpdate(productId, { 
      $inc: { currentStock: quantity } 
    });
  }

  async findProductByBarcode(barcode: string): Promise<Product | null> {
    const doc = await ProductModel.findOne({ barcode });
    return doc ? StoreMapper.toProductEntity(doc) : null;
  }

  async findProductById(id: string): Promise<Product | null> {
    const doc = await ProductModel.findById(id);
    return doc ? StoreMapper.toProductEntity(doc) : null;
  }

  // Kardex
  async registerMovement(movement: Partial<InventoryMovement>): Promise<InventoryMovement> {
    const doc = await InventoryMovementModel.create(movement);
    return StoreMapper.toMovementEntity(doc);
  }

  async listMovements(filters?: { productId?: string; type?: string }): Promise<InventoryMovement[]> {
    const query: any = {};
    if (filters?.productId) query.productId = filters.productId;
    if (filters?.type) query.type = filters.type;

    const docs = await InventoryMovementModel.find(query)
      .populate('productId')
      .populate('performedBy', 'email')
      .sort({ createdAt: -1 });
    return docs.map(StoreMapper.toMovementEntity);
  }

  // Ventas
  async createSale(sale: Partial<Sale>): Promise<Sale> {
    const doc = await SaleModel.create(sale);
    return StoreMapper.toSaleEntity(doc);
  }

  async listSales(): Promise<Sale[]> {
    const docs = await SaleModel.find()
      .populate('items.productId')
      .populate('performedBy', 'email')
      .sort({ createdAt: -1 });
    return docs.map(StoreMapper.toSaleEntity);
  }
}
