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
      await dbConnect();
      await dbConnect();
      // console.log('DEBUG RoleGuard: Verifying user ID:', initialUser.id, 'Role:', initialUser.role);
      const dbUser = await UserModel.findById(initialUser.id).populate('roleId');

      if (!dbUser) {
        // console.log('DEBUG RoleGuard: User not found in DB', initialUser.id);
        return { error: 'USER_NOT_FOUND', status: 401 };
      }

      if (!dbUser.isActive) {
        return { error: 'USER_INACTIVE', status: 403 };
      }

      if (dbUser.deletedAt) {
        return { error: 'USER_DELETED', status: 403 };
      }

      // 3. Validar Rol (usando el del token o el de la DB, preferiblemente DB para estar al día)
      // Asumimos que initialUser.role viene del token y coincide, pero si cambiaron roles en caliente,
      // la DB es la verdad absoluta.
      // Sin embargo, para no romper compatibilidad con `initialUser.role` (string) vs populated role,
      // validaremos contra el token O refactorizaremos para usar el rol de la DB.

      // Para mantener simplicidad y consistencia con el diseño actual que confía en el 'role' string del token:
      if (!roles.includes(initialUser.role)) {
        return { error: 'FORBIDDEN', status: 403 };
      }

      return { user: initialUser, error: null };

    } catch (error) {
      console.error('RoleGuard DB Error:', error);
      return { error: 'INTERNAL_SECURITY_ERROR', status: 500 };
    }
  };
}


