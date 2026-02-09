import { NextResponse } from 'next/server';
import { dbConnect } from '@/infrastructure/db/mongo/connection';
import { loginUserUseCase } from '@/config/dependencies';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const result = await loginUserUseCase.execute(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 401 }
    );
  }
}
