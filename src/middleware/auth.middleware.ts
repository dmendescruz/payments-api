import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../auth/jwt.service';

// Extende o tipo Request do Express para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  // Verifica se o header Authorization existe e está no formato correto
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Token de autenticação não fornecido.',
      },
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = payload; // disponibiliza o usuário para os próximos handlers
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Token inválido ou expirado.',
      },
    });
  }
}