import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'super-secret-key';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Rutas públicas de la API
  if (path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // 2. Si la ruta NO es de la API (es una página del frontend), permitir acceso
  // El frontend manejará la lógica de redirección si no hay sesión
  if (!path.startsWith('/api')) {
    return NextResponse.next();
  }

  // 3. Verificar token para el resto de rutas de la API
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log('Middleware: Token verificado para', (decoded as any).email);
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-data', JSON.stringify(decoded));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'INVALID_TOKEN' }, { status: 401 });
  }
}

// Configurar en qué rutas se aplica el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

