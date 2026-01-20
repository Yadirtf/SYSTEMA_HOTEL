import { NextResponse } from 'next/server';
import { updateRoomTypeUseCase, deleteRoomTypeUseCase } from '@/config/dependencies';
import { requireRole } from '@/infrastructure/security/RoleGuard';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireRole(['ADMIN'])(request);
  if (guard.error || !guard.user) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await params;

  try {
    const body = await request.json();
    await updateRoomTypeUseCase.execute({ id, ...body });
    return NextResponse.json({ message: 'Tipo de habitación actualizado correctamente' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireRole(['ADMIN'])(request);
  if (guard.error || !guard.user) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await params;

  try {
    await deleteRoomTypeUseCase.execute(id);
    return NextResponse.json({ message: 'Tipo de habitación eliminado correctamente' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}


