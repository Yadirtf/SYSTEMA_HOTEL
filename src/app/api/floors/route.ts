import { NextResponse } from 'next/server';
import { listFloorsUseCase, createFloorUseCase } from '@/config/dependencies';
import { requireRole } from '@/infrastructure/security/RoleGuard';
import { dbConnect } from '@/infrastructure/db/mongo/connection';

export async function GET(request: Request) {
  await dbConnect();
  const guard = await requireRole(['ADMIN', 'RECEPCIONISTA'])(request);
  if (guard.error || !guard.user) return NextResponse.json({ error: guard.error }, { status: guard.status });

  try {
    const floors = await listFloorsUseCase.execute();
    return NextResponse.json(floors);
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
    await createFloorUseCase.execute(body);
    return NextResponse.json({ message: 'Piso creado correctamente' }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 400 }
    );
  }
}
