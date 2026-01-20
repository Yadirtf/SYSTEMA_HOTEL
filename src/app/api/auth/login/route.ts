import { NextResponse } from 'next/server';
import { dbConnect } from '@/infrastructure/db/mongo/connection';
import { loginUserUseCase } from '@/config/dependencies';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const result = await loginUserUseCase.execute(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
