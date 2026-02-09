import { NextResponse } from 'next/server';
import { listRoomsUseCase, createRoomUseCase } from '@/config/dependencies';
import { requireRole } from '@/infrastructure/security/RoleGuard';
import { dbConnect } from '@/infrastructure/db/mongo/connection';

export async function GET(request: Request) {
  await dbConnect();
  const guard = await requireRole(['ADMIN', 'RECEPCIONISTA'])(request);
  if (guard.error || !guard.user) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { searchParams } = new URL(request.url);
  const floorId = searchParams.get('floorId') || undefined;

  try {
    const rooms = await listRoomsUseCase.execute(floorId);
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  const guard = await requireRole(['ADMIN'])(request);
  if (guard.error || !guard.user) return NextResponse.json({ error: guard.error }, { status: guard.status });

  try {
    const body = await request.json();
    await createRoomUseCase.execute(body);
    return NextResponse.json({ message: 'Habitación creada correctamente' }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 400 }
    );
  }
}
