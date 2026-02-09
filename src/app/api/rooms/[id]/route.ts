import { NextResponse } from 'next/server';
import { updateRoomStatusUseCase, deleteRoomUseCase } from '@/config/dependencies';
import { requireRole } from '@/infrastructure/security/RoleGuard';
import { dbConnect } from '@/infrastructure/db/mongo/connection';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const guard = await requireRole(['ADMIN', 'RECEPCIONISTA'])(request);
  if (guard.error || !guard.user) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await params;

  try {
    const body = await request.json();
    if (body.status) {
      await updateRoomStatusUseCase.execute(id, body.status);
    }
    return NextResponse.json({ message: 'Estado de habitación actualizado' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 400 }
    );
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
    await deleteRoomUseCase.execute(id);
    return NextResponse.json({ message: 'Habitación eliminada correctamente' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 400 }
    );
  }
}

