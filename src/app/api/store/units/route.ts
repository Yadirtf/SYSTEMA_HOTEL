import { NextResponse } from 'next/server';
import { unitUseCases } from '@/config/dependencies';
import { dbConnect } from '@/infrastructure/db/mongo/connection';
import { requireRole } from '@/infrastructure/security/RoleGuard';

export async function GET() {
  try {
    await dbConnect();
    const units = await unitUseCases.executeList();
    return NextResponse.json(units);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const guard = await requireRole(['ADMIN', 'RECEPCIONIST'])(req);
    if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

    await dbConnect();
    const data = await req.json();
    const unit = await unitUseCases.executeCreate(data);
    return NextResponse.json(unit, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

