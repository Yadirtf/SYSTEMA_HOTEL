import { NextResponse } from 'next/server';
import { updateFloorUseCase, deleteFloorUseCase } from '@/config/dependencies';
import { requireRole } from '@/infrastructure/security/RoleGuard';
import { dbConnect } from '@/infrastructure/db/mongo/connection';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const guard = await requireRole(['ADMIN'])(request);
  if (guard.error || !guard.user) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await params;

  try {
    const body = await request.json();
    await updateFloorUseCase.execute({ id, ...body });
    return NextResponse.json({ message: 'Piso actualizado correctamente' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const guard = await requireRole(['ADMIN'])(request);
  if (guard.error || !guard.user) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await params;

  try {
    await deleteFloorUseCase.execute(id);
    return NextResponse.json({ message: 'Piso eliminado correctamente' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
