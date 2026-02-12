import { NextResponse } from 'next/server';
import { productUseCases } from '@/config/dependencies';
import { dbConnect } from '@/infrastructure/db/mongo/connection';
import { requireRole } from '@/infrastructure/security/RoleGuard';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireRole(['ADMIN', 'RECEPCIONISTA'])(req);
    if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

    const { id } = await params;
    await dbConnect();
    const data = await req.json();
    const product = await productUseCases.executeUpdate(id, data);
    return NextResponse.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    if (message === 'BARCODE_ALREADY_EXISTS') {
      return NextResponse.json({ error: 'El código de barras ya está registrado en otro producto.' }, { status: 400 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireRole(['ADMIN'])(req);
    if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

    const { id } = await params;
    await dbConnect();
    await productUseCases.executeDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
