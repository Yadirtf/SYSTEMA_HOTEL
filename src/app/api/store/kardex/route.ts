import { NextResponse } from 'next/server';
import { kardexUseCases } from '@/config/dependencies';
import { dbConnect } from '@/infrastructure/db/mongo/connection';
import { requireRole } from '@/infrastructure/security/RoleGuard';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId') || undefined;
    const type = searchParams.get('type') || undefined;

    await dbConnect();
    const movements = await kardexUseCases.executeList({ productId, type });
    return NextResponse.json(movements);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const guard = await requireRole(['ADMIN', 'RECEPCIONIST'])(req);
    if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

    await dbConnect();
    const data = await req.json();

    // Asignar el usuario que realiza el movimiento desde el token
    const movement = await kardexUseCases.executeRegister({
      ...data,
      performedBy: guard.user?.sub // El ID del usuario está en el sub del token JWT
    });

    return NextResponse.json(movement, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

