import { NextResponse } from 'next/server';
import { connectDB } from '@/infrastructure/db/mongo/connection';
import { getSystemStatusUseCase } from '@/config/dependencies';

export async function GET() {
  try {
    await connectDB();
    const status = await getSystemStatusUseCase.execute();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

