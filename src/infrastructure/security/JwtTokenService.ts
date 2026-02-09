import jwt from 'jsonwebtoken';
import { TokenService } from '../../domain/security/TokenService';

export class JwtTokenService implements TokenService {
  private readonly SECRET = process.env.JWT_SECRET || 'super-secret-key';
  private readonly EXPIRES_IN = '1d';

  generate(payload: Record<string, unknown>): string {
    return jwt.sign(payload, this.SECRET, { expiresIn: this.EXPIRES_IN });
  }

  verify(token: string): Record<string, unknown> | null {
    try {
      return jwt.verify(token, this.SECRET) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}

