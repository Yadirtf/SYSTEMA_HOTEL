import { NextResponse } from 'next/server';
import { dbConnect } from '@/infrastructure/db/mongo/connection';
import { registerAdminUseCase } from '@/config/dependencies';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const result = await registerAdminUseCase.execute(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
