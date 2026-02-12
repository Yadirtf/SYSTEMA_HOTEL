import { NextResponse } from 'next/server';
import { categoryUseCases } from '@/config/dependencies';
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
    const category = await categoryUseCases.executeUpdate(id, data);
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
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
    await categoryUseCases.executeDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
