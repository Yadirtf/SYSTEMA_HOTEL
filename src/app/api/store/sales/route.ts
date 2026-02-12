import { NextResponse } from 'next/server';
import { saleUseCases } from '@/config/dependencies';
import { dbConnect } from '@/infrastructure/db/mongo/connection';
import { requireRole } from '@/infrastructure/security/RoleGuard';

export async function GET() {
  try {
    await dbConnect();
    const sales = await saleUseCases.executeList();
    return NextResponse.json(sales);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const guard = await requireRole(['ADMIN', 'RECEPCIONISTA'])(req);
    if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

    await dbConnect();
    const data = await req.json();

    const sale = await saleUseCases.executeCreate({
      ...data,
      performedBy: guard.user?.id
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    let status = 500;
    let errorMessage = message;

    if (message.startsWith('PRODUCT_NOT_FOUND')) {
      errorMessage = 'Uno de los productos no existe.';
      status = 400;
    } else if (message.startsWith('PRODUCT_INACTIVE')) {
      const productName = message.split(':')[1];
      errorMessage = `El producto "${productName}" está desactivado y no se puede vender.`;
      status = 400;
    } else if (message.startsWith('INSUFFICIENT_STOCK')) {
      const productName = message.split(':')[1];
      errorMessage = `Stock insuficiente para el producto "${productName}".`;
      status = 400;
    }

    return NextResponse.json({ error: errorMessage }, { status });
  }
}

