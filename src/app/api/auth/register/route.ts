import { NextResponse } from 'next/server';
import { connectDB } from '@/infrastructure/db/mongo/connection';
import { registerAdminUseCase } from '@/config/dependencies';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    await registerAdminUseCase.execute(body);
    
    return NextResponse.json({ message: 'Admin registered successfully' }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'SYSTEM_ALREADY_INITIALIZED') {
      return NextResponse.json({ error: 'SYSTEM_ALREADY_INITIALIZED' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

