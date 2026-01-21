import { NextResponse } from 'next/server';
import { productUseCases } from '@/config/dependencies';
import { dbConnect } from '@/infrastructure/db/mongo/connection';
import { requireRole } from '@/infrastructure/security/RoleGuard';

export async function GET() {
  try {
    await dbConnect();
    const products = await productUseCases.executeList();
    return NextResponse.json(products);
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
    
    // Pasar el ID del usuario para el registro del stock inicial si existe
    const product = await productUseCases.executeCreate({
      ...data,
      // @ts-ignore - Usamos un campo temporal para pasar el usuario al caso de uso
      performedBy: guard.user.sub
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error.message === 'BARCODE_ALREADY_EXISTS') {
      return NextResponse.json({ error: 'El código de barras ya está registrado en otro producto.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

