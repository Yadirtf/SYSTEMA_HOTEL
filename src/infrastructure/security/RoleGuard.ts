import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

interface GuardResult {
  user?: any;
  error: string | null;
  status?: number;
}

export function requireRole(roles: string[]) {
  return async (request: Request): Promise<GuardResult> => {
    const headersList = await headers();
    const userDataHeader = headersList.get('x-user-data');
    
    if (!userDataHeader) {
      console.log('RoleGuard: No x-user-data header found in next/headers');
      // Intento con el objeto request directo
      const requestUserData = request.headers.get('x-user-data');
      if (!requestUserData) {
        return { error: 'UNAUTHORIZED', status: 401 };
      }
      return processUserData(requestUserData, roles);
    }

    return processUserData(userDataHeader, roles);
  };
}

function processUserData(userDataHeader: string, roles: string[]): GuardResult {
  try {
    const user = JSON.parse(userDataHeader);
    if (!roles.includes(user.role)) {
      return { error: 'FORBIDDEN', status: 403 };
    }
    return { user, error: null };
  } catch (e) {
    return { error: 'INVALID_USER_DATA', status: 401 };
  }
}

