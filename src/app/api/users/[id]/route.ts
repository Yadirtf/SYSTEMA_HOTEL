import { NextResponse } from 'next/server';
import { dbConnect } from '@/infrastructure/db/mongo/connection';
import { deleteUserUseCase, updateUserStatusUseCase, updateUserUseCase } from '@/config/dependencies';
import { requireRole } from '@/infrastructure/security/RoleGuard';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const guard = await requireRole(['ADMIN'])(request);
  if (guard.error || !guard.user) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await params;

  try {
    await deleteUserUseCase.execute(id);
    return NextResponse.json({ message: 'Usuario eliminado correctamente' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

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
    
    // Si viene isActive, usamos UpdateUserStatusUseCase
    if (body.isActive !== undefined) {
      await updateUserStatusUseCase.execute(id, body.isActive);
    } else {
      // Si vienen otros datos, usamos UpdateUserUseCase
      await updateUserUseCase.execute({ id, ...body });
    }

    return NextResponse.json({ message: 'Usuario actualizado correctamente' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
