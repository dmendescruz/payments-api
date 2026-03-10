import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateTokens, verifyToken } from './jwt.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Simulação de usuário em memória — será substituído pelo banco na Etapa 6
const MOCK_USER = {
  id: '1',
  email: 'dev@payments-api.com',
  // bcrypt hash de "senha123" — nunca salvar senha em texto puro
  passwordHash: bcrypt.hashSync('senha123', 12),
};

// POST /auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Email e senha são obrigatórios.',
      },
    });
    return;
  }

  // Simula busca do usuário no banco
  if (email !== MOCK_USER.email) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        // Mensagem genérica — não informamos se é o email ou senha que está errado
        message: 'Credenciais inválidas.',
      },
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, MOCK_USER.passwordHash);

  if (!passwordMatch) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Credenciais inválidas.',
      },
    });
    return;
  }

  const tokens = generateTokens(MOCK_USER.id, MOCK_USER.email);

  res.json({
    success: true,
    data: tokens,
  });
});

// POST /auth/refresh
router.post('/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({
      success: false,
      error: { code: 'BAD_REQUEST', message: 'Refresh token não fornecido.' },
    });
    return;
  }

  try {
    const payload = verifyToken(refreshToken);
    const tokens = generateTokens(payload.sub, payload.email);

    res.json({ success: true, data: tokens });
  } catch {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Refresh token inválido ou expirado.' },
    });
  }
});

// POST /auth/logout — rota protegida
router.post('/logout', authMiddleware, (req: Request, res: Response) => {
  // Na Etapa 5 (Redis) adicionaremos o jti à blacklist
  res.json({
    success: true,
    data: { message: 'Logout realizado com sucesso.' },
  });
});

// GET /auth/me — retorna dados do usuário autenticado
router.get('/me', authMiddleware, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: { user: req.user },
  });
});

export default router;