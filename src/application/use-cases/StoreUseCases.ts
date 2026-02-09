import { StoreRepository } from "@/domain/repositories/StoreRepository";
import { ProductCategory, Unit, Product, InventoryMovement, Sale } from "@/domain/entities/Store";

export class CategoryUseCases {
  constructor(private repository: StoreRepository) { }

  async executeCreate(data: Partial<ProductCategory>) {
    return await this.repository.createCategory(data);
  }

  async executeList() {
    return await this.repository.listCategories();
  }

  async executeUpdate(id: string, data: Partial<ProductCategory>) {
    return await this.repository.updateCategory(id, data);
  }

  async executeDelete(id: string) {
    return await this.repository.deleteCategory(id);
  }
}

export class UnitUseCases {
  constructor(private repository: StoreRepository) { }

  async executeCreate(data: Partial<Unit>) {
    return await this.repository.createUnit(data);
  }

  async executeList() {
    return await this.repository.listUnits();
  }

  async executeUpdate(id: string, data: Partial<Unit>) {
    return await this.repository.updateUnit(id, data);
  }

  async executeDelete(id: string) {
    return await this.repository.deleteUnit(id);
  }
}

export class ProductUseCases {
  constructor(private repository: StoreRepository) { }

  async executeCreate(data: Partial<Product> & { performedBy?: string }) {
    // 1. Validar código de barras único si se proporciona
    if (data.barcode) {
      const existing = await this.repository.findProductByBarcode(data.barcode);
      if (existing) {
        throw new Error('BARCODE_ALREADY_EXISTS');
      }
    }

    // 2. Crear el producto
    const product = await this.repository.createProduct(data);

    // 3. Si tiene stock inicial, registrar movimiento en Kardex para trazabilidad
    if (data.currentStock && data.currentStock > 0) {
      await this.repository.registerMovement({
        productId: product.id,
        type: 'IN',
        quantity: data.currentStock,
        unitCost: data.purchasePrice || 0,
        reason: 'STOCK_INICIAL',
        performedBy: data.performedBy || '000000000000000000000000' // ID dummy si no hay usuario
      });
    }

    return product;
  }

  async executeList() {
    return await this.repository.listProducts();
  }

  async executeUpdate(id: string, data: Partial<Product>) {
    // 1. Validar código de barras único si se está cambiando
    if (data.barcode) {
      const existing = await this.repository.findProductByBarcode(data.barcode);
      if (existing && existing.id !== id) {
        throw new Error('BARCODE_ALREADY_EXISTS');
      }
    }

    return await this.repository.updateProduct(id, data);
  }

  async executeDelete(id: string) {
    return await this.repository.deleteProduct(id);
  }
}

export class KardexUseCases {
  constructor(private repository: StoreRepository) { }

  async executeRegister(data: Partial<InventoryMovement>) {
    // 1. Registrar el movimiento inmutable
    const movement = await this.repository.registerMovement(data);

    // 2. Calcular impacto en stock (IN suma, OUT resta)
    const stockImpact = data.type === 'IN' ? data.quantity! : -data.quantity!;

    // 3. Actualizar el cache de stock en el producto
    await this.repository.updateStock(data.productId!, stockImpact);

    return movement;
  }

  async executeList(filters?: { productId?: string; type?: string }) {
    return await this.repository.listMovements(filters);
  }
}

export class SaleUseCases {
  constructor(private repository: StoreRepository) { }

  async executeCreate(data: Partial<Sale>) {
    // 1. Validaciones previas por cada producto
    for (const item of data.items!) {
      const product = await this.repository.findProductById(item.productId);

      if (!product) {
        throw new Error(`PRODUCT_NOT_FOUND:${item.productId}`);
      }

      if (!product.isActive) {
        throw new Error(`PRODUCT_INACTIVE:${product.name}`);
      }

      if (product.currentStock < item.quantity) {
        throw new Error(`INSUFFICIENT_STOCK:${product.name}`);
      }
    }

    // 2. Crear la venta
    const sale = await this.repository.createSale(data);

    // 2. Por cada item, registrar salida en Kardex y actualizar stock
    for (const item of data.items!) {
      await this.repository.registerMovement({
        productId: item.productId,
        type: 'OUT',
        quantity: item.quantity,
        unitCost: item.unitPrice, // En ventas guardamos el precio al que salió
        reason: 'VENTA_MOSTRADOR',
        reference: sale.id,
        performedBy: data.performedBy!
      });

      await this.repository.updateStock(item.productId, -item.quantity);
    }

    return sale;
  }

  async executeList() {
    return await this.repository.listSales();
  }
}
