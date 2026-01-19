import { NextResponse } from 'next/server';
import { listRoomsUseCase, createRoomUseCase } from '@/config/dependencies';
import { requireRole } from '@/infrastructure/security/RoleGuard';

export async function GET(request: Request) {
  const guard = await requireRole(['ADMIN', 'RECEPCIONISTA'])(request);
  if (guard.error || !guard.user) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { searchParams } = new URL(request.url);
  const floorId = searchParams.get('floorId');

  try {
    const rooms = await listRoomsUseCase.execute(floorId || undefined);
    return NextResponse.json(rooms);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard = await requireRole(['ADMIN'])(request);
  if (guard.error || !guard.user) return NextResponse.json({ error: guard.error }, { status: guard.status });

  try {
    const body = await request.json();
    await createRoomUseCase.execute(body);
    return NextResponse.json({ message: 'Habitación creada correctamente' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
