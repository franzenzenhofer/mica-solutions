import jwt from 'jsonwebtoken';
import { z } from 'zod';

const TokenPayloadSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer']),
  organizations: z.array(z.string()).optional(),
});

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;

export class JWTService {
  private readonly secret: string;
  private readonly expiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(
    secret: string = process.env.JWT_SECRET || 'change-this-secret',
    expiresIn: string = '7d',
    refreshExpiresIn: string = '30d'
  ) {
    this.secret = secret;
    this.expiresIn = expiresIn;
    this.refreshExpiresIn = refreshExpiresIn;
  }

  generateToken(payload: TokenPayload): string {
    const validated = TokenPayloadSchema.parse(payload);
    return jwt.sign(validated, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign({ userId, type: 'refresh' }, this.secret, {
      expiresIn: this.refreshExpiresIn,
    });
  }

  verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as any;
      return TokenPayloadSchema.parse(decoded);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }

  verifyRefreshToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, this.secret) as any;
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }
      return { userId: decoded.userId };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token expired');
      }
      throw new Error('Invalid refresh token');
    }
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.decode(token) as any;
      return TokenPayloadSchema.parse(decoded);
    } catch {
      return null;
    }
  }
}