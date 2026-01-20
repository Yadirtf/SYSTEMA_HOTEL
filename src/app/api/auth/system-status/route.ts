import { NextResponse } from 'next/server';
import { dbConnect } from '@/infrastructure/db/mongo/connection';
import { getSystemStatusUseCase } from '@/config/dependencies';

export async function GET() {
  await dbConnect();
  try {
    const status = await getSystemStatusUseCase.execute();
    return NextResponse.json(status);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
