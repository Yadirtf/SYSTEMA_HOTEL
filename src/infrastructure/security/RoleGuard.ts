import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { dbConnect } from '@/infrastructure/db/mongo/connection';
import { UserModel } from '@/infrastructure/db/mongo/models/UserModel';

interface DecodedUser {
  id: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

interface GuardResult {
  user?: DecodedUser;
  error: string | null;
  status?: number;
}

export function requireRole(roles: string[]) {
  return async (request: Request): Promise<GuardResult> => {
    const headersList = await headers();
    const userDataHeader = headersList.get('x-user-data');

    // 1. Obtener datos básicos del token
    let initialUser: DecodedUser | null = null;
    let token: string | null = null;

    if (userDataHeader) {
      try {
        initialUser = JSON.parse(userDataHeader);
      } catch (e) {
        return { error: 'INVALID_USER_DATA', status: 401 };
      }
    }

    // FALLBACK: Si no hay header del middleware, verificamos el token manualmente
    if (!initialUser) {
      const authHeader = headersList.get('authorization') || request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
        try {
          // Import dinámico para asegurar que se usa solo en el servidor (Node runtime)
          const jwt = await import('jsonwebtoken');
          const SECRET = process.env.JWT_SECRET || 'super-secret-key';
          initialUser = jwt.default.verify(token, SECRET) as DecodedUser;
        } catch (error) {
          console.log('RoleGuard: Token verification failed', error);
          return { error: 'INVALID_TOKEN', status: 401 };
        }
      }
    }

    if (!initialUser || !initialUser.id) {
      console.log('RoleGuard: No user data or token found');
      return { error: 'UNAUTHORIZED', status: 401 };
    }

    // 2. VERIFICACIÓN DE SEGURIDAD EN TIEMPO REAL (DB)
    try {
      await dbConnect(); // Aún necesitamos conectar a la BD, pero la lógica está abstraída

      // Instanciar dependencias manualmente (DI simple para este contexto)
      // En una app más grande usaríamos un contenedor de inyección
      const { MongoUserRepository } = await import('@/infrastructure/repositories/MongoUserRepository'); // Import dinámico para evitar ciclos si los hubiera
      const userRepository = new MongoUserRepository();
      const { AuthVerificationService } = await import('@/application/services/AuthVerificationService');
      const authService = new AuthVerificationService(userRepository);

      const result = await authService.verifyUser(initialUser.id, roles);

      if (!result.isValid) {
        return { error: result.error || 'UNAUTHORIZED', status: result.status || 401 };
      }

      // El usuario es válido y tiene el rol correcto
      // Retornamos los datos frescos de la BD (via servicio)
      return {
        user: {
          id: result.user!.id,
          email: result.user!.email,
          role: result.user!.role
        },
        error: null
      };

    } catch (error) {
      console.error('RoleGuard DB Error:', error);
      return { error: 'INTERNAL_SECURITY_ERROR', status: 500 };
    }
  };
}


