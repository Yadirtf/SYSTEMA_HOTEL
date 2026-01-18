import { NextResponse } from 'next/server';
import { connectDB } from '@/infrastructure/db/mongo/connection';
import { deleteUserUseCase, updateUserStatusUseCase } from '@/config/dependencies';
import { requireRole } from '@/infrastructure/security/RoleGuard';

type Params = Promise<{ id: string }>;

// DELETE /api/users/:id - Borrado lógico (Solo ADMIN)
export async function DELETE(request: Request, { params }: { params: Params }) {
  const guard = await requireRole(['ADMIN'])(request);
  if (guard.error || !guard.user) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await params;
  if (guard.user.sub === id) {
    return NextResponse.json({ error: 'CANNOT_DELETE_SELF' }, { status: 400 });
  }

  try {
    await connectDB();
    await deleteUserUseCase.execute(id);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/users/:id - Actualizar estado o datos (Solo ADMIN)
export async function PATCH(request: Request, { params }: { params: Params }) {
  const guard = await requireRole(['ADMIN'])(request);
  if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await params;
  try {
    await connectDB();
    const body = await request.json();
    
    if (body.isActive !== undefined) {
      await updateUserStatusUseCase.execute(id, body.isActive);
    }
    
    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

