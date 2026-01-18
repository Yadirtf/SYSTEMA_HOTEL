import { NextResponse } from 'next/server';
import { connectDB } from '@/infrastructure/db/mongo/connection';
import { loginUserUseCase } from '@/config/dependencies';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const result = await loginUserUseCase.execute(body);
    
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
    }
    if (error.message === 'USER_INACTIVE') {
      return NextResponse.json({ error: 'USER_INACTIVE' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

