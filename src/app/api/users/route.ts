import { NextResponse } from 'next/server';
import { connectDB } from '@/infrastructure/db/mongo/connection';
import { listUsersUseCase, createUserUseCase } from '@/config/dependencies';
import { requireRole } from '@/infrastructure/security/RoleGuard';

// GET /api/users - Listar usuarios (Solo ADMIN)
export async function GET(request: Request) {
  const guard = await requireRole(['ADMIN'])(request);
  if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

  try {
    await connectDB();
    const users = await listUsersUseCase.execute();
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/users - Crear usuario (Solo ADMIN)
export async function POST(request: Request) {
  const guard = await requireRole(['ADMIN'])(request);
  if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

  try {
    await connectDB();
    const body = await request.json();
    await createUserUseCase.execute(body);
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'EMAIL_ALREADY_EXISTS') {
      return NextResponse.json({ error: 'EMAIL_ALREADY_EXISTS' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

