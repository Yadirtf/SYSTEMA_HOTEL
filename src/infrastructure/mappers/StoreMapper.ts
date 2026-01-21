import { ProductCategory, Unit, Product, InventoryMovement, Sale } from "@/domain/entities/Store";
import { ProductCategoryDocument, UnitDocument, ProductDocument, InventoryMovementDocument, SaleDocument } from "../db/mongo/models/StoreModels";

export class StoreMapper {
  static toCategoryEntity(doc: ProductCategoryDocument): ProductCategory {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      isActive: doc.isActive,
      createdAt: (doc as any).createdAt,
      updatedAt: (doc as any).updatedAt,
    };
  }

  static toUnitEntity(doc: UnitDocument): Unit {
    return {
      id: doc._id.toString(),
      name: doc.name,
      abbreviation: doc.abbreviation,
      isActive: doc.isActive,
      createdAt: (doc as any).createdAt,
      updatedAt: (doc as any).updatedAt,
    };
  }

  static toProductEntity(doc: any): Product {
    const rawDoc = doc.toObject ? doc.toObject() : doc;
    return {
      id: rawDoc._id.toString(),
      name: rawDoc.name,
      description: rawDoc.description,
      // Intentar obtener de barcode o del campo crudo por si Mongoose lo oculta
      barcode: rawDoc.barcode || doc.barcode || rawDoc.sku || doc.sku || '',
      // Manejar campos poblados (populate) o IDs directos
      categoryId: rawDoc.categoryId?._id?.toString() || rawDoc.categoryId?.toString(),
      categoryName: rawDoc.categoryId?.name, // Extraer nombre si está poblado
      unitId: rawDoc.unitId?._id?.toString() || rawDoc.unitId?.toString(),
      unitName: rawDoc.unitId?.name, // Extraer nombre si está poblado
      purchasePrice: rawDoc.purchasePrice,
      salePrice: rawDoc.salePrice,
      currentStock: rawDoc.currentStock,
      isActive: rawDoc.isActive,
      createdAt: rawDoc.createdAt,
      updatedAt: rawDoc.updatedAt,
    };
  }

  static toMovementEntity(doc: any): InventoryMovement {
    return {
      id: doc._id.toString(),
      productId: doc.productId?._id?.toString() || doc.productId?.toString(),
      type: doc.type,
      quantity: doc.quantity,
      unitCost: doc.unitCost,
      reason: doc.reason,
      reference: doc.reference,
      performedBy: doc.performedBy?._id?.toString() || doc.performedBy?.toString(),
      createdAt: (doc as any).createdAt,
    };
  }

  static toSaleEntity(doc: any): Sale {
    return {
      id: doc._id.toString(),
      items: doc.items.map((item: any) => ({
        productId: item.productId?._id?.toString() || item.productId?.toString(),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
      })),
      totalAmount: doc.totalAmount,
      paymentMethod: doc.paymentMethod,
      performedBy: doc.performedBy?._id?.toString() || doc.performedBy?.toString(),
      createdAt: (doc as any).createdAt,
    };
  }
}
