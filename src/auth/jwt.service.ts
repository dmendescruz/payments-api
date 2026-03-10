import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import fs from 'fs';
import { env } from '../config/env';

// Carrega as chaves uma única vez ao iniciar a aplicação
const privateKey = fs.readFileSync(env.jwt.privateKeyPath, 'utf8');
const publicKey = fs.readFileSync(env.jwt.publicKeyPath, 'utf8');

export interface TokenPayload {
  sub: string;   // ID do usuário
  email: string;
  jti: string;   // ID único do token (usado para blacklist)
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Gera um ID único para cada token (usado na blacklist de logout)
function generateJti(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function generateTokens(userId: string, email: string): AuthTokens {
  const payload: TokenPayload = {
    sub: userId,
    email,
    jti: generateJti(),
  };

  const accessToken = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: env.jwt.expiresIn,
  } as SignOptions);

  const refreshToken = jwt.sign(
    { sub: userId, jti: generateJti() },
    privateKey,
    {
      algorithm: 'RS256',
      expiresIn: env.jwt.refreshExpiresIn,
    } as SignOptions,
  );

  return { accessToken, refreshToken };
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, publicKey, {
    algorithms: ['RS256'],
  }) as JwtPayload;

  return {
    sub: decoded.sub as string,
    email: decoded.email as string,
    jti: decoded.jti as string,
  };
}