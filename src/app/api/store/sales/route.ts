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
    const guard = await requireRole(['ADMIN', 'RECEPCIONIST'])(req);
    if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

    await dbConnect();
    const data = await req.json();
    
    const sale = await saleUseCases.executeCreate({
      ...data,
      performedBy: guard.user.sub
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error: any) {
    let message = error.message;
    let status = 500;

    if (error.message.startsWith('PRODUCT_NOT_FOUND')) {
      message = 'Uno de los productos no existe.';
      status = 400;
    } else if (error.message.startsWith('PRODUCT_INACTIVE')) {
      const productName = error.message.split(':')[1];
      message = `El producto "${productName}" está desactivado y no se puede vender.`;
      status = 400;
    } else if (error.message.startsWith('INSUFFICIENT_STOCK')) {
      const productName = error.message.split(':')[1];
      message = `Stock insuficiente para el producto "${productName}".`;
      status = 400;
    }

    return NextResponse.json({ error: message }, { status });
  }
}

