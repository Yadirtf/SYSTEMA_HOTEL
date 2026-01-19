import { NextResponse } from 'next/server';
import { listRoomTypesUseCase, createRoomTypeUseCase } from '@/config/dependencies';
import { requireRole } from '@/infrastructure/security/RoleGuard';

export async function GET(request: Request) {
  const guard = await requireRole(['ADMIN', 'RECEPCIONISTA'])(request);
  if (guard.error || !guard.user) return NextResponse.json({ error: guard.error }, { status: guard.status });

  try {
    const types = await listRoomTypesUseCase.execute();
    return NextResponse.json(types);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard = await requireRole(['ADMIN'])(request);
  if (guard.error || !guard.user) return NextResponse.json({ error: guard.error }, { status: guard.status });

  try {
    const body = await request.json();
    await createRoomTypeUseCase.execute(body);
    return NextResponse.json({ message: 'Tipo de habitación creado correctamente' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
