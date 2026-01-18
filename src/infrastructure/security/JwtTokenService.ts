import jwt from 'jsonwebtoken';
import { TokenService } from '../../domain/security/TokenService';

export class JwtTokenService implements TokenService {
  private readonly SECRET = process.env.JWT_SECRET || 'super-secret-key';
  private readonly EXPIRES_IN = '1d';

  generate(payload: any): string {
    return jwt.sign(payload, this.SECRET, { expiresIn: this.EXPIRES_IN });
  }

  verify(token: string): any {
    try {
      return jwt.verify(token, this.SECRET);
    } catch (error) {
      return null;
    }
  }
}

