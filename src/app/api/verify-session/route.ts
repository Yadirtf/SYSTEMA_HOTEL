
import { NextResponse } from 'next/server';
import { dbConnect } from '@/infrastructure/db/mongo/connection';
import { requireRole } from '@/infrastructure/security/RoleGuard';

export async function GET(request: Request) {
    try {
        await dbConnect();
        // Verify token and user status in DB
        // We allow any role because we just want to know if the user is valid and active
        // The roles list includes all possible roles
        const roles = ['ADMIN', 'RECEPCIONISTA', 'VENDEDOR'];
        const guard = await requireRole(roles)(request);

        if (guard.error || !guard.user) {
            return NextResponse.json({ valid: false, error: guard.error }, { status: 401 });
        }

        return NextResponse.json({ valid: true, user: guard.user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ valid: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
