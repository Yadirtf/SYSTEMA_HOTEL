import { ProductCategory, Unit, Product, InventoryMovement, Sale } from "@/domain/entities/Store";
import { ProductCategoryDocument, UnitDocument, ProductDocument, InventoryMovementDocument, SaleDocument } from "../db/mongo/models/StoreModels";

export class StoreMapper {
  static toCategoryEntity(doc: ProductCategoryDocument): ProductCategory {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toUnitEntity(doc: UnitDocument): Unit {
    return {
      id: doc._id.toString(),
      name: doc.name,
      abbreviation: doc.abbreviation,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toProductEntity(doc: ProductDocument): Product {
    const rawDoc = doc.toObject ? doc.toObject() : doc;
    // Helper type for potentially populated fields
    type PopulatedDoc = typeof rawDoc & {
      categoryId?: { _id: string; name: string } | string;
      unitId?: { _id: string; name: string } | string;
    };
    const docWithPopulated = rawDoc as PopulatedDoc;
    return {
      id: rawDoc._id.toString(),
      name: rawDoc.name,
      description: rawDoc.description,
      // Intentar obtener de barcode o del campo crudo por si Mongoose lo oculta
      barcode: rawDoc.barcode || (docWithPopulated as any).barcode || (docWithPopulated as any).sku || '',
      // Manejar campos poblados (populate) o IDs directos
      categoryId: (typeof docWithPopulated.categoryId === 'object' && docWithPopulated.categoryId) ? docWithPopulated.categoryId._id.toString() : docWithPopulated.categoryId?.toString(),
      categoryName: (typeof docWithPopulated.categoryId === 'object' && docWithPopulated.categoryId) ? docWithPopulated.categoryId.name : undefined,
      unitId: (typeof docWithPopulated.unitId === 'object' && docWithPopulated.unitId) ? docWithPopulated.unitId._id.toString() : docWithPopulated.unitId?.toString(),
      unitName: (typeof docWithPopulated.unitId === 'object' && docWithPopulated.unitId) ? docWithPopulated.unitId.name : undefined,
      purchasePrice: rawDoc.purchasePrice,
      salePrice: rawDoc.salePrice,
      currentStock: rawDoc.currentStock,
      isActive: rawDoc.isActive,
      createdAt: rawDoc.createdAt,
      updatedAt: rawDoc.updatedAt,
    };
  }

  static toMovementEntity(doc: InventoryMovementDocument): InventoryMovement {
    const docWithPopulated = doc as unknown as {
      productId?: { _id: string; name: string } | string;
      performedBy?: { _id: string; email: string } | string;
    };
    return {
      id: doc._id.toString(),
      productId: (typeof docWithPopulated.productId === 'object' && docWithPopulated.productId) ? docWithPopulated.productId._id.toString() : docWithPopulated.productId?.toString() || '',
      type: doc.type,
      quantity: doc.quantity,
      unitCost: doc.unitCost,
      reason: doc.reason,
      reference: doc.reference,
      performedBy: (typeof docWithPopulated.performedBy === 'object' && docWithPopulated.performedBy) ? docWithPopulated.performedBy._id.toString() : docWithPopulated.performedBy?.toString() || '',
      createdAt: doc.createdAt,
    };
  }

  static toSaleEntity(doc: SaleDocument): Sale {
    const docWithPopulated = doc as unknown as {
      performedBy?: { _id: string; email: string } | string;
    };
    return {
      id: doc._id.toString(),
      items: doc.items.map((item) => {
        const itemWithPopulated = item as unknown as { productId?: { _id: string } | string };
        return {
          productId: (typeof itemWithPopulated.productId === 'object' && itemWithPopulated.productId) ? itemWithPopulated.productId._id.toString() : itemWithPopulated.productId?.toString() || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total
        };
      }),
      totalAmount: doc.totalAmount,
      paymentMethod: doc.paymentMethod,
      performedBy: (typeof docWithPopulated.performedBy === 'object' && docWithPopulated.performedBy) ? docWithPopulated.performedBy._id.toString() : docWithPopulated.performedBy?.toString() || '',
      createdAt: doc.createdAt,
    };
  }
}
