export interface TokenService {
  generate(payload: Record<string, unknown>): string;
  verify(token: string): Record<string, unknown> | null;
}

